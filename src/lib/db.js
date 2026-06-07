import { supabase } from './supabase';

// ── Mappers ───────────────────────────────────────────────────────────────────
function toUser(row) {
  if (!row) return null;
  return {
    id:            row.id,
    email:         row.email,
    phone:         row.phone,
    name:          row.name,
    role:          row.role,
    riderStatus:   row.rider_status,
    vehicleType:   row.vehicle_type,
    vehiclePlate:  row.vehicle_plate,
    vehicleColor:  row.vehicle_color,
    motorcycle:    row.motorcycle,
    plate:         row.plate,
    licensePhoto:  row.license_photo,
    vehiclePhoto:  row.vehicle_photo,
    licenseNumber: row.license_number,
    nationalId:    row.national_id,
    earnings:      row.earnings      ?? 0,
    totalTrips:    row.total_trips   ?? 0,
    rating:        row.rating,
    ratingCount:   row.rating_count  ?? 0,
    createdAt:     row.created_at,
  };
}

function fromUser(data) {
  const row = {};
  if (data.email         !== undefined) row.email          = data.email;
  if (data.phone         !== undefined) row.phone          = data.phone;
  if (data.name          !== undefined) row.name           = data.name;
  if (data.role          !== undefined) row.role           = data.role;
  if (data.riderStatus   !== undefined) row.rider_status   = data.riderStatus;
  if (data.vehicleType   !== undefined) row.vehicle_type   = data.vehicleType;
  if (data.vehiclePlate  !== undefined) row.vehicle_plate  = data.vehiclePlate;
  if (data.vehicleColor  !== undefined) row.vehicle_color  = data.vehicleColor;
  if (data.motorcycle    !== undefined) row.motorcycle     = data.motorcycle;
  if (data.plate         !== undefined) row.plate          = data.plate;
  if (data.licensePhoto  !== undefined) row.license_photo  = data.licensePhoto;
  if (data.vehiclePhoto  !== undefined) row.vehicle_photo  = data.vehiclePhoto;
  if (data.licenseNumber !== undefined) row.license_number = data.licenseNumber;
  if (data.nationalId    !== undefined) row.national_id    = data.nationalId;
  if (data.earnings      !== undefined) row.earnings       = data.earnings;
  if (data.totalTrips    !== undefined) row.total_trips    = data.totalTrips;
  if (data.rating        !== undefined) row.rating         = data.rating;
  if (data.ratingCount   !== undefined) row.rating_count   = data.ratingCount;
  return row;
}

function toTrip(row) {
  if (!row) return null;
  return {
    id:              row.id,
    passengerId:     row.passenger_id,
    passengerName:   row.passenger_name,
    passengerPhone:  row.passenger_phone,
    riderId:         row.rider_id,
    riderName:       row.rider_name,
    riderPhone:      row.rider_phone,
    riderMotorcycle: row.rider_motorcycle,
    riderPlate:      row.rider_plate,
    riderRating:     row.rider_rating,
    pickup:          row.pickup,
    pickupLat:       row.pickup_lat,
    pickupLng:       row.pickup_lng,
    destination:     row.destination,
    destLat:         row.dest_lat,
    destLng:         row.dest_lng,
    fare:            row.fare,
    distance:        row.distance,
    duration:        row.duration,
    status:          row.status,
    passengerRating: row.passenger_rating,
    passengerComment:row.passenger_comment,
    acceptedAt:      row.accepted_at,
    completedAt:     row.completed_at,
    cancelledAt:     row.cancelled_at,
    createdAt:       row.created_at,
  };
}

function fromTrip(data) {
  const row = {};
  if (data.passengerId      !== undefined) row.passenger_id      = data.passengerId;
  if (data.passengerName    !== undefined) row.passenger_name    = data.passengerName;
  if (data.passengerPhone   !== undefined) row.passenger_phone   = data.passengerPhone;
  if (data.riderId          !== undefined) row.rider_id          = data.riderId;
  if (data.riderName        !== undefined) row.rider_name        = data.riderName;
  if (data.riderPhone       !== undefined) row.rider_phone       = data.riderPhone;
  if (data.riderMotorcycle  !== undefined) row.rider_motorcycle  = data.riderMotorcycle;
  if (data.riderPlate       !== undefined) row.rider_plate       = data.riderPlate;
  if (data.riderRating      !== undefined) row.rider_rating      = data.riderRating;
  if (data.pickup           !== undefined) row.pickup            = data.pickup;
  if (data.pickupLat        !== undefined) row.pickup_lat        = data.pickupLat;
  if (data.pickupLng        !== undefined) row.pickup_lng        = data.pickupLng;
  if (data.destination      !== undefined) row.destination       = data.destination;
  if (data.destLat          !== undefined) row.dest_lat          = data.destLat;
  if (data.destLng          !== undefined) row.dest_lng          = data.destLng;
  if (data.fare             !== undefined) row.fare              = data.fare;
  if (data.distance         !== undefined) row.distance          = data.distance;
  if (data.duration         !== undefined) row.duration          = data.duration;
  if (data.status           !== undefined) row.status            = data.status;
  if (data.passengerRating  !== undefined) row.passenger_rating  = data.passengerRating;
  if (data.passengerComment !== undefined) row.passenger_comment = data.passengerComment;
  if (data.acceptedAt       !== undefined) row.accepted_at       = data.acceptedAt;
  if (data.completedAt      !== undefined) row.completed_at      = data.completedAt;
  if (data.cancelledAt      !== undefined) row.cancelled_at      = data.cancelledAt;
  return row;
}

// ── Bootstrap (no-op for Supabase — admin created via Auth dashboard) ─────────
export async function bootstrap() {}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function findUserByEmail(email) {
  const { data } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  return toUser(data);
}

export async function findUserById(id) {
  const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
  return toUser(data);
}

export async function createUser(data) {
  const row = fromUser(data);
  if (data.id) row.id = data.id;
  const { data: created, error } = await supabase.from('users').insert(row).select().single();
  if (error) throw error;
  return toUser(created);
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
export async function createTrip(data) {
  const row = { status: 'requested', ...fromTrip(data) };
  const { data: created, error } = await supabase.from('trips').insert(row).select().single();
  if (error) throw error;
  return toTrip(created);
}

export async function updateTrip(id, patch) {
  const row = fromTrip(patch);
  const { data, error } = await supabase.from('trips').update(row).eq('id', id).select().single();
  if (error) throw error;
  return toTrip(data);
}

export async function getTrip(id) {
  const { data } = await supabase.from('trips').select('*').eq('id', id).maybeSingle();
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
  const { data } = await supabase.from('trips').select('*')
    .eq(col, uid)
    .in('status', ['requested','accepted','arrived','started'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return toTrip(data);
}

export async function getPendingTrip() {
  const { data } = await supabase.from('trips').select('*')
    .eq('status', 'requested')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return toTrip(data);
}
