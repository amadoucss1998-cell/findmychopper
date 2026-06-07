import { uid } from './utils';

// ── Raw storage helpers ───────────────────────────────────────────────────────
function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Collections ───────────────────────────────────────────────────────────────
const KEYS = { users: 'fmc_users', trips: 'fmc_trips', otps: 'fmc_otps', session: 'fmc_session' };

function getUsers()  { return read(KEYS.users)  || []; }
function getTrips()  { return read(KEYS.trips)  || []; }
function getOTPs()   { return read(KEYS.otps)   || []; }

function saveUsers(u) { write(KEYS.users, u); }
function saveTrips(t) { write(KEYS.trips, t); }
function saveOTPs(o)  { write(KEYS.otps, o); }

// ── Bootstrap admin account ───────────────────────────────────────────────────
export function bootstrap() {
  const users = getUsers();
  const hasAdmin = users.some(u => u.role === 'admin');
  if (!hasAdmin) {
    users.push({
      id:        'admin-1',
      name:      'Super Admin',
      phone:     '+231000000000',
      email:     'admin@findmychopper.com',
      role:      'admin',
      createdAt: Date.now(),
    });
    saveUsers(users);
  }
}

// ── OTP ───────────────────────────────────────────────────────────────────────
export function createOTP(phone, code) {
  const otps = getOTPs().filter(o => o.phone !== phone); // replace any existing
  otps.push({ phone, code, expiresAt: Date.now() + 5 * 60 * 1000 });
  saveOTPs(otps);
}

export function verifyOTP(phone, code) {
  const otps = getOTPs();
  const otp  = otps.find(o => o.phone === phone && o.code === code && o.expiresAt > Date.now());
  if (!otp) return false;
  saveOTPs(otps.filter(o => o.phone !== phone));
  return true;
}

export function getOTPForPhone(phone) {
  return getOTPs().find(o => o.phone === phone) || null;
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function findUserByPhone(phone) {
  return getUsers().find(u => u.phone === phone) || null;
}

export function createUser(data) {
  const users = getUsers();
  const user  = { id: uid(), createdAt: Date.now(), ...data };
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(id, patch) {
  const users = getUsers().map(u => u.id === id ? { ...u, ...patch } : u);
  saveUsers(users);
  return users.find(u => u.id === id);
}

export function getAllUsers()     { return getUsers(); }
export function getAllRiders()    { return getUsers().filter(u => u.role === 'rider'); }
export function getAllPassengers(){ return getUsers().filter(u => u.role === 'passenger'); }

// ── Trips ─────────────────────────────────────────────────────────────────────
export function createTrip(data) {
  const trips = getTrips();
  const trip  = { id: uid(), createdAt: Date.now(), status: 'requested', ...data };
  trips.unshift(trip);
  saveTrips(trips);
  return trip;
}

export function updateTrip(id, patch) {
  const trips = getTrips().map(t => t.id === id ? { ...t, ...patch } : t);
  saveTrips(trips);
  return trips.find(t => t.id === id);
}

export function getTrip(id)               { return getTrips().find(t => t.id === id) || null; }
export function getAllTrips()              { return getTrips(); }
export function getTripsForPassenger(pid) { return getTrips().filter(t => t.passengerId === pid); }
export function getTripsForRider(rid)     { return getTrips().filter(t => t.riderId === rid); }
export function getActiveTrip(uid, role)  {
  const active = ['requested','accepted','arrived','started'];
  return getTrips().find(t =>
    active.includes(t.status) &&
    (role === 'passenger' ? t.passengerId === uid : t.riderId === uid)
  ) || null;
}
export function getPendingTrip() {
  return getTrips().find(t => t.status === 'requested') || null;
}

// ── Session ───────────────────────────────────────────────────────────────────
export function getSession()          { return read(KEYS.session); }
export function saveSession(user)     { write(KEYS.session, user); }
export function clearSession()        { localStorage.removeItem(KEYS.session); }
