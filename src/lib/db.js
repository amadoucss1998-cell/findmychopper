import { supabase } from './supabase';

// ── Row mappers ───────────────────────────────────────────────────────────────
function toUser(r) {
  if (!r) return null;
  return {
    id:           r.id,
    phone:        r.phone,
    name:         r.name,
    email:        r.email,
    role:         r.role,
    riderStatus:  r.rider_status,
    vehicleType:  r.vehicle_type,
    vehiclePlate: r.vehicle_plate,
    vehicleColor: r.vehicle_color,
    motorcycle:   r.motorcycle,
    plate:        r.plate,
    licensePhoto: r.license_photo,
    vehiclePhoto: r.vehicle_photo,
    earnings:     r.earnings     ?? 0,
    totalTrips:   r.total_trips  ?? 0,
    rating:       r.rating       ?? null,
    ratingCount:  r.rating_count ?? 0,
    createdAt:    new Date(r.created_at).getTime(),
  };
}

function fromUser(d) {
  const r = {};
  if (d.phone        !== undefined) r.phone         = d.phone;
  if (d.name         !== undefined) r.name          = d.name;
  if (d.email        !== undefined) r.email         = d.email;
  if (d.role         !== undefined) r.role          = d.role;
  if (d.riderStatus  !== undefined) r.rider_status  = d.riderStatus;
  if (d.vehicleType  !== undefined) r.vehicle_type  = d.vehicleType;
  if (d.vehiclePlate !== undefined) r.vehicle_plate = d.vehiclePlate;
  if (d.vehicleColor !== undefined) r.vehicle_color = d.vehicleColor;
  if (d.motorcycle   !== undefined) r.motorcycle    = d.motorcycle;
  if (d.plate        !== undefined) r.plate         = d.plate;
  if (d.licensePhoto !== undefined) r.license_photo = d.licensePhoto;
  if (d.vehiclePhoto !== undefined) r.vehicle_photo = d.vehiclePhoto;
  if (d.earnings     !== undefined) r.earnings      = d.earnings;
  if (d.totalTrips   !== undefined) r.total_trips   = d.totalTrips;
  if (d.rating       !== undefined) r.rating        = d.rating;
  if (d.ratingCount  !== undefined) r.rating_count  = d.ratingCount;
  return r;
}

function toTrip(r) {
  if (!r) return null;
  return {
    id:               r.id,
    passengerId:      r.passenger_id,
    riderId:          r.rider_id,
    passengerName:    r.passenger_name,
    riderName:        r.rider_name,
    passengerPhone:   r.passenger_phone,
    riderPhone:       r.rider_phone,
    riderMotorcycle:  r.rider_motorcycle,
    riderPlate:       r.rider_plate,
    riderRating:      r.rider_rating,
    pickup:           r.pickup,
    pickupLat:        r.pickup_lat,
    pickupLng:        r.pickup_lng,
    destination:      r.destination,
    destLat:          r.dest_lat,
    destLng:          r.dest_lng,
    fare:             r.fare,
    distance:         r.distance,
    duration:         r.duration,
    status:           r.status,
    passengerRating:  r.passenger_rating,
    passengerComment: r.passenger_comment,
    acceptedAt:       r.accepted_at  ? new Date(r.accepted_at).getTime()  : null,
    completedAt:      r.completed_at ? new Date(r.completed_at).getTime() : null,
    cancelledAt:      r.cancelled_at ? new Date(r.cancelled_at).getTime() : null,
    createdAt:        new Date(r.created_at).getTime(),
  };
}

function fromTrip(d) {
  const r = {};
  if (d.passengerId      !== undefined) r.passenger_id      = d.passengerId;
  if (d.riderId          !== undefined) r.rider_id          = d.riderId;
  if (d.passengerName    !== undefined) r.passenger_name    = d.passengerName;
  if (d.riderName        !== undefined) r.rider_name        = d.riderName;
  if (d.passengerPhone   !== undefined) r.passenger_phone   = d.passengerPhone;
  if (d.riderPhone       !== undefined) r.rider_phone       = d.riderPhone;
  if (d.riderMotorcycle  !== undefined) r.rider_motorcycle  = d.riderMotorcycle;
  if (d.riderPlate       !== undefined) r.rider_plate       = d.riderPlate;
  if (d.riderRating      !== undefined) r.rider_rating      = d.riderRating;
  if (d.pickup           !== undefined) r.pickup            = d.pickup;
  if (d.pickupLat        !== undefined) r.pickup_lat        = d.pickupLat;
  if (d.pickupLng        !== undefined) r.pickup_lng        = d.pickupLng;
  if (d.destination      !== undefined) r.destination       = d.destination;
  if (d.destLat          !== undefined) r.dest_lat          = d.destLat;
  if (d.destLng          !== undefined) r.dest_lng          = d.destLng;
  if (d.fare             !== undefined) r.fare              = d.fare;
  if (d.distance         !== undefined) r.distance          = d.distance;
  if (d.duration         !== undefined) r.duration          = d.duration;
  if (d.status           !== undefined) r.status            = d.status;
  if (d.passengerRating  !== undefined) r.passenger_rating  = d.passengerRating;
  if (d.passengerComment !== undefined) r.passenger_comment = d.passengerComment;
  if (d.acceptedAt       !== undefined) r.accepted_at       = d.acceptedAt ? new Date(d.acceptedAt).toISOString() : null;
  if (d.completedAt      !== undefined) r.completed_at      = d.completedAt ? new Date(d.completedAt).toISOString() : null;
  if (d.cancelledAt      !== undefined) r.cancelled_at      = d.cancelledAt ? new Date(d.cancelledAt).toISOString() : null;
  return r;
}

// ── Bootstrap admin account ───────────────────────────────────────────────────
export async function bootstrap() {
  const { data } = await supabase.from('users').select('id').eq('role', 'admin').limit(1);
  if (!data?.length) {
    await supabase.from('users').insert({
      phone: '+231000000000',
      name:  'Super Admin',
      email: 'admin@findmychopper.com',
      role:  'admin',
    });
  }
}

// ── OTP ───────────────────────────────────────────────────────────────────────
export async function createOTP(phone, code) {
  await supabase.from('otps').upsert({
    phone,
    code,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
}

export async function verifyOTP(phone, code) {
  const { data } = await supabase
    .from('otps')
    .select('*')
    .eq('phone', phone)
    .eq('code', code)
    .gt('expires_at', new Date().toISOString())
    .limit(1);
  if (!data?.length) return false;
  await supabase.from('otps').delete().eq('phone', phone);
  return true;
}

export async function getOTPForPhone(phone) {
  const { data } = await supabase.from('otps').select('*').eq('phone', phone).limit(1);
  if (!data?.[0]) return null;
  return { phone: data[0].phone, code: data[0].code, expiresAt: new Date(data[0].expires_at).getTime() };
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function findUserByPhone(phone) {
  const { data } = await supabase.from('users').select('*').eq('phone', phone).limit(1);
  return toUser(data?.[0] || null);
}

export async function createUser(userData) {
  const { data, error } = await supabase.from('users').insert(fromUser(userData)).select().single();
  if (error) throw error;
  return toUser(data);
}

export async function updateUser(id, patch) {
  const row = fromUser(patch);
  const { data, error } = await supabase.from('users').update(row).eq('id', id).select().single();
  if (error) throw error;
  return toUser(data);
}

export async function getAllUsers()      {
  const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  return (data || []).map(toUser);
}
export async function getAllRiders()     {
  const { data } = await supabase.from('users').select('*').eq('role', 'rider').order('created_at', { ascending: false });
  return (data || []).map(toUser);
}
export async function getAllPassengers() {
  const { data } = await supabase.from('users').select('*').eq('role', 'passenger').order('created_at', { ascending: false });
  return (data || []).map(toUser);
}

// ── Trips ─────────────────────────────────────────────────────────────────────
export async function createTrip(tripData) {
  const { data, error } = await supabase.from('trips').insert(fromTrip(tripData)).select().single();
  if (error) throw error;
  return toTrip(data);
}

export async function updateTrip(id, patch) {
  const row = fromTrip(patch);
  const { data, error } = await supabase.from('trips').update(row).eq('id', id).select().single();
  if (error) throw error;
  return toTrip(data);
}

export async function getTrip(id) {
  const { data } = await supabase.from('trips').select('*').eq('id', id).single();
  return toTrip(data);
}

export async function getAllTrips() {
  const { data } = await supabase.from('trips').select('*').order('created_at', { ascending: false });
  return (data || []).map(toTrip);
}

export async function getTripsForPassenger(pid) {
  const { data } = await supabase.from('trips').select('*').eq('passenger_id', pid).order('created_at', { ascending: false });
  return (data || []).map(toTrip);
}

export async function getTripsForRider(rid) {
  const { data } = await supabase.from('trips').select('*').eq('rider_id', rid).order('created_at', { ascending: false });
  return (data || []).map(toTrip);
}

export async function getActiveTrip(uid, role) {
  const col = role === 'passenger' ? 'passenger_id' : 'rider_id';
  const { data } = await supabase
    .from('trips').select('*')
    .eq(col, uid)
    .in('status', ['requested','accepted','arrived','started'])
    .limit(1);
  return toTrip(data?.[0] || null);
}

export async function getPendingTrip() {
  const { data } = await supabase
    .from('trips').select('*')
    .eq('status', 'requested')
    .order('created_at', { ascending: true })
    .limit(1);
  return toTrip(data?.[0] || null);
}

// ── Session (localStorage — auth state only) ──────────────────────────────────
const SESSION_KEY = 'fmc_session';
export function getSession()      { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }
export function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
export function clearSession()    { localStorage.removeItem(SESSION_KEY); }
