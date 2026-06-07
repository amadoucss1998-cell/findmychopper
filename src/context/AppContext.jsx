import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import * as db from '../lib/db';
import { calcFare, haversine, locationByName } from '../lib/utils';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user,          setUser]          = useState(null);
  const [authReady,     setAuthReady]     = useState(false);
  const [activeTrip,    setActiveTrip]    = useState(null);
  const [cachedUsers,   setCachedUsers]   = useState([]);
  const [cachedTrips,   setCachedTrips]   = useState([]);
  const realtimeSub = useRef(null);

  // ── Restore session from Supabase Auth ───────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await db.findUserById(session.user.id);
        if (profile) {
          setUser(profile);
          const trip = await db.getActiveTrip(profile.id, profile.role);
          if (trip) setActiveTrip(trip);
        }
      }
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setActiveTrip(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Realtime: subscribe to trips when user is logged in ──────────────────
  useEffect(() => {
    if (!user) return;
    realtimeSub.current = supabase
      .channel('trips-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, async payload => {
        const trip = payload.new;
        if (!trip) return;

        const isMine =
          (user.role === 'passenger' && trip.passenger_id === user.id) ||
          (user.role === 'rider'     && trip.rider_id     === user.id) ||
          user.role === 'admin';

        if (isMine && activeTrip && trip.id === activeTrip.id) {
          const fresh = await db.getTrip(trip.id);
          setActiveTrip(['completed','cancelled'].includes(fresh?.status) ? null : fresh);
        }

        if (user.role === 'admin') {
          setCachedTrips(prev => {
            const idx = prev.findIndex(t => t.id === trip.id);
            const mapped = {
              id: trip.id,
              passengerId: trip.passenger_id,
              passengerName: trip.passenger_name,
              riderId: trip.rider_id,
              riderName: trip.rider_name,
              pickup: trip.pickup,
              destination: trip.destination,
              fare: trip.fare,
              distance: trip.distance,
              status: trip.status,
              createdAt: trip.created_at,
            };
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = mapped;
              return next;
            }
            return [mapped, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      realtimeSub.current?.unsubscribe();
    };
  }, [user?.id]);

  // ── Load admin caches ─────────────────────────────────────────────────────
  useEffect(() => {
    if (user?.role !== 'admin') return;
    db.getAllUsers().then(setCachedUsers);
    db.getAllTrips().then(setCachedTrips);
  }, [user?.id]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await db.findUserById(data.user.id);
    if (!profile) throw new Error('Profile not found');
    setUser(profile);
    const trip = await db.getActiveTrip(profile.id, profile.role);
    if (trip) setActiveTrip(trip);
    return profile;
  }

  async function signUp({ email, password, name, role, phone, ...extra }) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const profile = await db.createUser({
      id: data.user.id,
      email,
      name,
      role,
      phone: phone || null,
      riderStatus: role === 'rider' ? 'pending' : null,
      ...extra,
    });
    setUser(profile);
    return profile;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setActiveTrip(null);
  }

  async function updateProfile(patch) {
    if (!user) return;
    const updated = await db.updateUser(user.id, patch);
    setUser(updated);
    return updated;
  }

  // ── Passenger: request a ride ─────────────────────────────────────────────
  async function requestRide({ pickup, destination }) {
    const pLoc = locationByName(pickup);
    const dLoc = locationByName(destination);
    const distKm = haversine(pLoc.lat, pLoc.lng, dLoc.lat, dLoc.lng);
    const durationMin = Math.round(distKm / 0.3 + 2);
    const fare = calcFare(distKm, durationMin);

    const trip = await db.createTrip({
      passengerId:    user.id,
      passengerName:  user.name,
      passengerPhone: user.phone || null,
      pickup,
      pickupLat:      pLoc.lat,
      pickupLng:      pLoc.lng,
      destination,
      destLat:        dLoc.lat,
      destLng:        dLoc.lng,
      fare,
      distance:       distKm,
      duration:       durationMin,
    });
    setActiveTrip(trip);
    return trip;
  }

  async function cancelTrip() {
    if (!activeTrip) return;
    await db.updateTrip(activeTrip.id, { status: 'cancelled', cancelledAt: new Date().toISOString() });
    setActiveTrip(null);
  }

  async function submitPassengerRating(score, comment = '') {
    if (!activeTrip) return;
    await db.updateTrip(activeTrip.id, { passengerRating: score, passengerComment: comment });
    if (activeTrip.riderId) {
      const riderTrips = await db.getTripsForRider(activeTrip.riderId);
      const rated = riderTrips.filter(t => t.passengerRating);
      const avg = rated.reduce((s, t) => s + t.passengerRating, 0) / rated.length;
      await db.updateUser(activeTrip.riderId, {
        rating: parseFloat(avg.toFixed(1)),
        ratingCount: rated.length,
      });
    }
    setActiveTrip(null);
  }

  // ── Rider ─────────────────────────────────────────────────────────────────
  async function acceptTrip(tripId) {
    const updated = await db.updateTrip(tripId, {
      riderId:         user.id,
      riderName:       user.name,
      riderPhone:      user.phone || null,
      riderMotorcycle: user.motorcycle,
      riderPlate:      user.plate,
      riderRating:     user.rating || 0,
      status:          'accepted',
      acceptedAt:      new Date().toISOString(),
    });
    setActiveTrip(updated);
  }

  async function advanceTripStatus() {
    if (!activeTrip) return;
    const next = { accepted: 'arrived', arrived: 'started', started: 'completed' };
    const newStatus = next[activeTrip.status];
    if (!newStatus) return;
    const patch = { status: newStatus };
    if (newStatus === 'completed') {
      patch.completedAt = new Date().toISOString();
      const earn = parseFloat((activeTrip.fare * 0.8).toFixed(2));
      const updated = await db.updateUser(user.id, {
        totalTrips: (user.totalTrips || 0) + 1,
        earnings:   parseFloat(((user.earnings || 0) + earn).toFixed(2)),
      });
      setUser(updated);
    }
    const updated = await db.updateTrip(activeTrip.id, patch);
    setActiveTrip(newStatus === 'completed' ? null : updated);
  }

  function declineTrip() { setActiveTrip(null); }

  // ── Admin ─────────────────────────────────────────────────────────────────
  async function approveRider(id) {
    await db.updateUser(id, { riderStatus: 'approved' });
    setCachedUsers(prev => prev.map(u => u.id === id ? { ...u, riderStatus: 'approved' } : u));
  }
  async function suspendRider(id) {
    await db.updateUser(id, { riderStatus: 'suspended' });
    setCachedUsers(prev => prev.map(u => u.id === id ? { ...u, riderStatus: 'suspended' } : u));
  }
  async function rejectRider(id) {
    await db.updateUser(id, { riderStatus: 'rejected' });
    setCachedUsers(prev => prev.map(u => u.id === id ? { ...u, riderStatus: 'rejected' } : u));
  }
  async function reinstateRider(id) {
    await db.updateUser(id, { riderStatus: 'approved' });
    setCachedUsers(prev => prev.map(u => u.id === id ? { ...u, riderStatus: 'approved' } : u));
  }

  // ── Computed helpers ──────────────────────────────────────────────────────
  const getAllRiders     = useCallback(() => cachedUsers.filter(u => u.role === 'rider'),     [cachedUsers]);
  const getAllPassengers = useCallback(() => cachedUsers.filter(u => u.role === 'passenger'), [cachedUsers]);
  const getAllTrips      = useCallback(() => cachedTrips,                                      [cachedTrips]);
  const getMyTrips      = useCallback(() =>
    user ? (user.role === 'passenger'
      ? cachedTrips.filter(t => t.passengerId === user.id)
      : cachedTrips.filter(t => t.riderId    === user.id))
    : [], [user, cachedTrips]);

  // Load my own trips into cache when user changes
  useEffect(() => {
    if (!user || user.role === 'admin') return;
    const fn = user.role === 'passenger' ? db.getTripsForPassenger : db.getTripsForRider;
    fn(user.id).then(setCachedTrips);
  }, [user?.id]);

  const getPending = useCallback(() => db.getPendingTrip(), []);

  if (!authReady) return null;

  return (
    <Ctx.Provider value={{
      user,
      signIn, signUp, logout, updateProfile,
      activeTrip, setActiveTrip,
      requestRide, cancelTrip, submitPassengerRating,
      acceptTrip, advanceTripStatus, declineTrip,
      approveRider, suspendRider, rejectRider, reinstateRider,
      getAllRiders, getAllPassengers, getAllTrips, getMyTrips, getPending,
      updateUser: db.updateUser,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() { return useContext(Ctx); }
