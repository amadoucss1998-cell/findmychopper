import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as db from '../lib/db';
import { generateOTP, calcFare, haversine, locationByName, fmtDate } from '../lib/utils';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user,       setUser]       = useState(() => db.getSession());
  const [otpPhone,   setOtpPhone]   = useState('');
  const [otpCode,    setOtpCode]    = useState('');   // shown in UI
  const [activeTrip, setActiveTrip] = useState(null);

  // Bootstrap admin + restore active trip on mount
  useEffect(() => {
    db.bootstrap();
    if (user) {
      const trip = db.getActiveTrip(user.id, user.role);
      if (trip) setActiveTrip(trip);
    }
  }, []);

  // Poll for trip status changes (rider accepts, advances, etc.)
  useEffect(() => {
    if (!user || !activeTrip) return;
    const interval = setInterval(() => {
      const fresh = db.getTrip(activeTrip.id);
      if (fresh && fresh.status !== activeTrip.status) {
        setActiveTrip(fresh);
        if (['completed','cancelled'].includes(fresh.status)) {
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user, activeTrip]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  function sendOTP(phone) {
    const code = generateOTP();
    db.createOTP(phone, code);
    setOtpPhone(phone);
    setOtpCode(code);
    return code;
  }

  function verifyOTP(phone, code) {
    return db.verifyOTP(phone, code);
  }

  function loginWithUser(u) {
    db.saveSession(u);
    setUser(u);
    const trip = db.getActiveTrip(u.id, u.role);
    if (trip) setActiveTrip(trip);
  }

  function logout() {
    db.clearSession();
    setUser(null);
    setActiveTrip(null);
    setOtpPhone('');
    setOtpCode('');
  }

  function updateProfile(patch) {
    if (!user) return;
    const updated = db.updateUser(user.id, patch);
    db.saveSession(updated);
    setUser(updated);
  }

  // ── Passenger: request a ride ─────────────────────────────────────────────
  function requestRide({ pickup, destination }) {
    const pLoc = locationByName(pickup);
    const dLoc = locationByName(destination);
    const distKm = haversine(pLoc.lat, pLoc.lng, dLoc.lat, dLoc.lng);
    const durationMin = Math.round(distKm / 0.3 + 2);
    const fare = calcFare(distKm, durationMin);

    const trip = db.createTrip({
      passengerId:   user.id,
      passengerName: user.name,
      passengerPhone:user.phone,
      pickup,
      pickupLat:     pLoc.lat,
      pickupLng:     pLoc.lng,
      destination,
      destLat:       dLoc.lat,
      destLng:       dLoc.lng,
      fare,
      distance:      distKm,
      duration:      durationMin,
    });
    setActiveTrip(trip);
    return trip;
  }

  function cancelTrip() {
    if (!activeTrip) return;
    const updated = db.updateTrip(activeTrip.id, { status: 'cancelled', cancelledAt: Date.now() });
    setActiveTrip(null);
  }

  function submitPassengerRating(score, comment = '') {
    if (!activeTrip) return;
    db.updateTrip(activeTrip.id, { passengerRating: score, passengerComment: comment });
    if (activeTrip.riderId) {
      const riderTrips = db.getTripsForRider(activeTrip.riderId).filter(t => t.passengerRating);
      const avg = riderTrips.reduce((s, t) => s + t.passengerRating, 0) / riderTrips.length;
      db.updateUser(activeTrip.riderId, { rating: parseFloat(avg.toFixed(1)), ratingCount: riderTrips.length });
    }
    setActiveTrip(null);
  }

  // ── Rider ─────────────────────────────────────────────────────────────────
  function acceptTrip(tripId) {
    const updated = db.updateTrip(tripId, {
      riderId:    user.id,
      riderName:  user.name,
      riderPhone: user.phone,
      riderMotorcycle: user.motorcycle,
      riderPlate: user.plate,
      riderRating: user.rating || 0,
      status:     'accepted',
      acceptedAt: Date.now(),
    });
    setActiveTrip(updated);
  }

  function advanceTripStatus() {
    if (!activeTrip) return;
    const next = { accepted: 'arrived', arrived: 'started', started: 'completed' };
    const newStatus = next[activeTrip.status];
    if (!newStatus) return;
    const patch = { status: newStatus };
    if (newStatus === 'completed') {
      patch.completedAt = Date.now();
      const earn = parseFloat((activeTrip.fare * 0.8).toFixed(2));
      db.updateUser(user.id, {
        totalTrips: (user.totalTrips || 0) + 1,
        earnings:   parseFloat(((user.earnings || 0) + earn).toFixed(2)),
      });
      const fresh = db.updateUser(user.id, {});
      db.saveSession(fresh);
      setUser(fresh);
    }
    const updated = db.updateTrip(activeTrip.id, patch);
    setActiveTrip(newStatus === 'completed' ? null : updated);
  }

  function declineTrip() {
    setActiveTrip(null);
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  function approveRider(id)  { db.updateUser(id, { riderStatus: 'approved' }); }
  function suspendRider(id)  { db.updateUser(id, { riderStatus: 'suspended' }); }
  function rejectRider(id)   { db.updateUser(id, { riderStatus: 'rejected' }); }
  function reinstateRider(id){ db.updateUser(id, { riderStatus: 'approved' }); }

  // ── Computed helpers ──────────────────────────────────────────────────────
  const getAllRiders    = useCallback(() => db.getAllRiders(),     []);
  const getAllPassengers= useCallback(() => db.getAllPassengers(), []);
  const getAllTrips     = useCallback(() => db.getAllTrips(),      []);
  const getMyTrips     = useCallback(() => user
    ? (user.role === 'passenger' ? db.getTripsForPassenger(user.id) : db.getTripsForRider(user.id))
    : [], [user]);
  const getPending     = useCallback(() => db.getPendingTrip(),   []);

  return (
    <Ctx.Provider value={{
      user, otpPhone, otpCode,
      sendOTP, verifyOTP, loginWithUser, logout, updateProfile,
      activeTrip, setActiveTrip,
      requestRide, cancelTrip, submitPassengerRating,
      acceptTrip, advanceTripStatus, declineTrip,
      approveRider, suspendRider, rejectRider, reinstateRider,
      getAllRiders, getAllPassengers, getAllTrips, getMyTrips, getPending,
      findUserByPhone: db.findUserByPhone,
      createUser: db.createUser,
      updateUser: db.updateUser,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() { return useContext(Ctx); }
