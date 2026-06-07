import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockRiders, mockPassengers, mockTrips } from '../data/mockData';

const AppContext = createContext(null);

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AppProvider({ children }) {
  const [user, setUser]           = useState(() => load('fmc_user', null));
  const [role, setRole]           = useState(() => load('fmc_role', null));
  const [riders, setRiders]       = useState(() => load('fmc_riders', mockRiders));
  const [passengers]              = useState(() => load('fmc_passengers', mockPassengers));
  const [trips, setTrips]         = useState(() => load('fmc_trips', mockTrips));
  const [activeTrip, setActiveTrip] = useState(() => load('fmc_activeTrip', null));
  const [riderOnline, setRiderOnline] = useState(() => load('fmc_riderOnline', false));

  // Persist on every change
  useEffect(() => { save('fmc_user', user); }, [user]);
  useEffect(() => { save('fmc_role', role); }, [role]);
  useEffect(() => { save('fmc_riders', riders); }, [riders]);
  useEffect(() => { save('fmc_trips', trips); }, [trips]);
  useEffect(() => { save('fmc_activeTrip', activeTrip); }, [activeTrip]);
  useEffect(() => { save('fmc_riderOnline', riderOnline); }, [riderOnline]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  function login(userData, userRole) {
    setUser(userData);
    setRole(userRole);
  }

  function logout() {
    setUser(null);
    setRole(null);
    setActiveTrip(null);
    setRiderOnline(false);
    localStorage.removeItem('fmc_user');
    localStorage.removeItem('fmc_role');
    localStorage.removeItem('fmc_activeTrip');
    localStorage.removeItem('fmc_riderOnline');
  }

  // ── Passenger: request a ride ─────────────────────────────────────────────
  function requestRide({ pickup, destination, fare, distance, eta }) {
    const trip = {
      id: `T${Date.now()}`,
      passengerId: user?.id || 'p1',
      passengerName: user?.name || 'Passenger',
      pickup,
      destination,
      fare,
      distance,
      eta,
      status: 'requested',
      rider: null,
      date: new Date().toLocaleString(),
    };
    setActiveTrip(trip);
    // Auto-match a rider after 2.5s
    setTimeout(() => {
      const available = riders.find(r => r.status === 'approved');
      if (!available) return;
      setActiveTrip(t => t ? {
        ...t,
        status: 'accepted',
        riderId: available.id,
        riderName: available.name,
        rider: available,
      } : t);
    }, 2500);
  }

  function cancelRide() {
    if (activeTrip) {
      setTrips(ts => [{ ...activeTrip, status: 'cancelled' }, ...ts]);
    }
    setActiveTrip(null);
  }

  // ── Rider: accept / decline ───────────────────────────────────────────────
  function acceptRide() {
    setActiveTrip(t => t ? { ...t, status: 'accepted' } : t);
  }

  function declineRide() {
    setActiveTrip(t => t ? { ...t, status: 'declined' } : t);
    setTimeout(() => setActiveTrip(null), 500);
  }

  // ── Rider: progress through trip ──────────────────────────────────────────
  function advanceTripStatus() {
    const next = { accepted: 'arrived', arrived: 'started', started: 'completed' };
    setActiveTrip(t => {
      if (!t) return t;
      const newStatus = next[t.status];
      if (!newStatus) return t;
      if (newStatus === 'completed') {
        const finished = { ...t, status: 'completed' };
        // Add to trip history
        setTrips(ts => [finished, ...ts]);
        // Update rider stats
        setRiders(rs => rs.map(r =>
          r.id === t.riderId
            ? { ...r, totalTrips: r.totalTrips + 1, earnings: r.earnings + t.fare * 0.8 }
            : r
        ));
        setTimeout(() => setActiveTrip(null), 200);
        return finished;
      }
      return { ...t, status: newStatus };
    });
  }

  // ── Admin: rider management ───────────────────────────────────────────────
  function approveRider(id) {
    setRiders(rs => rs.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  }

  function suspendRider(id) {
    setRiders(rs => rs.map(r => r.id === id ? { ...r, status: 'suspended' } : r));
  }

  function rejectRider(id) {
    setRiders(rs => rs.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  }

  // ── Profile update ────────────────────────────────────────────────────────
  function updateUser(data) {
    setUser(u => ({ ...u, ...data }));
  }

  function updateRiderProfile(data) {
    setRiders(rs => rs.map(r => r.id === (user?.riderId || '1') ? { ...r, ...data } : r));
  }

  // ── Rider online toggle ───────────────────────────────────────────────────
  function toggleOnline(val) {
    setRiderOnline(val);
    if (!val) setActiveTrip(null);
  }

  const myTrips = useCallback((id) =>
    trips.filter(t => t.passengerId === id || t.riderId === id),
  [trips]);

  return (
    <AppContext.Provider value={{
      user, role, login, logout, updateUser,
      riders, passengers, trips,
      approveRider, suspendRider, rejectRider,
      activeTrip, requestRide, cancelRide,
      acceptRide, declineRide, advanceTripStatus,
      riderOnline, toggleOnline,
      updateRiderProfile,
      myTrips,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
