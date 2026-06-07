import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as db from '../lib/db';
import { supabase } from '../lib/supabase';
import { generateOTP, calcFare, haversine, locationByName } from '../lib/utils';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user,        setUser]        = useState(() => db.getSession());
  const [otpPhone,    setOtpPhone]    = useState('');
  const [otpCode,     setOtpCode]     = useState('');
  const [activeTrip,  setActiveTrip]  = useState(null);

  // Cached data for admin pages (synchronous getters)
  const [cachedUsers, setCachedUsers] = useState([]);
  const [cachedTrips, setCachedTrips] = useState([]);

  const activeTripRef = useRef(activeTrip);
  activeTripRef.current = activeTrip;

  async function loadUsers() { setCachedUsers(await db.getAllUsers()); }
  async function loadTrips() { setCachedTrips(await db.getAllTrips()); }
  async function loadAll()   { await Promise.all([loadUsers(), loadTrips()]); }

  // Bootstrap + restore session data on mount
  useEffect(() => {
    db.bootstrap();
    loadAll();
    if (user) {
      db.getActiveTrip(user.id, user.role).then(trip => {
        if (trip) setActiveTrip(trip);
      });
    }
  }, []);

  // Supabase real-time: watch trips table for live updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('trips-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, async (payload) => {
        // Refresh cached trips for admin dashboards
        loadTrips();
        // Update activeTrip in-place if it changed
        const cur = activeTripRef.current;
        if (cur && payload.new && payload.new.id === cur.id) {
          const fresh = await db.getTrip(cur.id);
          if (fresh) {
            setActiveTrip(['completed', 'cancelled'].includes(fresh.status) ? null : fresh);
          }
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  async function sendOTP(phone) {
    const code = generateOTP();
    await db.createOTP(phone, code);
    setOtpPhone(phone);
    setOtpCode(code);
    return code;
  }

  async function verifyOTP(phone, code) {
    return db.verifyOTP(phone, code);
  }

  async function loginWithUser(u) {
    db.saveSession(u);
    setUser(u);
    const trip = await db.getActiveTrip(u.id, u.role);
    if (trip) setActiveTrip(trip);
  }

  function logout() {
    db.clearSession();
    setUser(null);
    setActiveTrip(null);
    setOtpPhone('');
    setOtpCode('');
  }

  async function updateProfile(patch) {
    if (!user) return;
    const updated = await db.updateUser(user.id, patch);
    db.saveSession(updated);
    setUser(updated);
    loadUsers();
  }

  // ── Passenger ─────────────────────────────────────────────────────────────
  async function requestRide({ pickup, destination }) {
    const pLoc = locationByName(pickup);
    const dLoc = locationByName(destination);
    const distKm     = haversine(pLoc.lat, pLoc.lng, dLoc.lat, dLoc.lng);
    const durationMin = Math.round(distKm / 0.3 + 2);
    const fare = calcFare(distKm, durationMin);

    const trip = await db.createTrip({
      passengerId:    user.id,
      passengerName:  user.name,
      passengerPhone: user.phone,
      pickup,
      pickupLat:  pLoc.lat,
      pickupLng:  pLoc.lng,
      destination,
      destLat:    dLoc.lat,
      destLng:    dLoc.lng,
      fare,
      distance:   distKm,
      duration:   durationMin,
    });
    setActiveTrip(trip);
    return trip;
  }

  async function cancelTrip() {
    if (!activeTrip) return;
    await db.updateTrip(activeTrip.id, { status: 'cancelled', cancelledAt: Date.now() });
    setActiveTrip(null);
  }

  async function submitPassengerRating(score, comment = '') {
    if (!activeTrip) return;
    await db.updateTrip(activeTrip.id, { passengerRating: score, passengerComment: comment });
    if (activeTrip.riderId) {
      const riderTrips = await db.getTripsForRider(activeTrip.riderId);
      const rated = riderTrips.filter(t => t.passengerRating);
      const avg   = rated.reduce((s, t) => s + t.passengerRating, 0) / (rated.length || 1);
      await db.updateUser(activeTrip.riderId, { rating: parseFloat(avg.toFixed(1)), ratingCount: rated.length });
    }
    setActiveTrip(null);
    loadAll();
  }

  // ── Rider ─────────────────────────────────────────────────────────────────
  async function acceptTrip(tripId) {
    const updated = await db.updateTrip(tripId, {
      riderId:         user.id,
      riderName:       user.name,
      riderPhone:      user.phone,
      riderMotorcycle: user.motorcycle,
      riderPlate:      user.plate,
      riderRating:     user.rating || 0,
      status:          'accepted',
      acceptedAt:      Date.now(),
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
      patch.completedAt = Date.now();
      const earn = parseFloat((activeTrip.fare * 0.8).toFixed(2));
      const updatedUser = await db.updateUser(user.id, {
        totalTrips: (user.totalTrips || 0) + 1,
        earnings:   parseFloat(((user.earnings || 0) + earn).toFixed(2)),
      });
      db.saveSession(updatedUser);
      setUser(updatedUser);
    }

    const updated = await db.updateTrip(activeTrip.id, patch);
    setActiveTrip(newStatus === 'completed' ? null : updated);
    loadAll();
  }

  function declineTrip() { setActiveTrip(null); }

  // ── Admin ─────────────────────────────────────────────────────────────────
  async function approveRider(id)   { await db.updateUser(id, { riderStatus: 'approved'  }); loadUsers(); }
  async function suspendRider(id)   { await db.updateUser(id, { riderStatus: 'suspended' }); loadUsers(); }
  async function rejectRider(id)    { await db.updateUser(id, { riderStatus: 'rejected'  }); loadUsers(); }
  async function reinstateRider(id) { await db.updateUser(id, { riderStatus: 'approved'  }); loadUsers(); }

  // ── Synchronous getters backed by cached state ────────────────────────────
  const getAllRiders     = useCallback(() => cachedUsers.filter(u => u.role === 'rider'),     [cachedUsers]);
  const getAllPassengers = useCallback(() => cachedUsers.filter(u => u.role === 'passenger'), [cachedUsers]);
  const getAllTrips      = useCallback(() => cachedTrips,                                     [cachedTrips]);
  const getMyTrips      = useCallback(() => {
    if (!user) return [];
    return user.role === 'passenger'
      ? cachedTrips.filter(t => t.passengerId === user.id)
      : cachedTrips.filter(t => t.riderId === user.id);
  }, [user, cachedTrips]);
  const getPendingTrip  = useCallback(() =>
    cachedTrips.find(t => t.status === 'requested') || null, [cachedTrips]);

  return (
    <Ctx.Provider value={{
      user, otpPhone, otpCode,
      sendOTP, verifyOTP, loginWithUser, logout, updateProfile,
      activeTrip, setActiveTrip,
      requestRide, cancelTrip, submitPassengerRating,
      acceptTrip, advanceTripStatus, declineTrip,
      approveRider, suspendRider, rejectRider, reinstateRider,
      getAllRiders, getAllPassengers, getAllTrips, getMyTrips, getPendingTrip,
      findUserByPhone: db.findUserByPhone,
      createUser:      db.createUser,
      updateUser:      (id, patch) => db.updateUser(id, patch).then(u => { loadUsers(); return u; }),
      refreshData:     loadAll,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() { return useContext(Ctx); }
