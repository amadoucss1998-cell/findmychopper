// ── Unique IDs ────────────────────────────────────────────────────────────────
export function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Pricing ───────────────────────────────────────────────────────────────────
const BASE_FARE    = 0.50;
const RATE_PER_KM  = 0.20;
const RATE_PER_MIN = 0.05;
const MIN_FARE     = 1.00;

export function calcFare(distKm, durationMin) {
  const raw = BASE_FARE + distKm * RATE_PER_KM + durationMin * RATE_PER_MIN;
  return Math.max(MIN_FARE, parseFloat(raw.toFixed(2)));
}

// ── Haversine distance (km) ───────────────────────────────────────────────────
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

// ── Monrovia neighbourhoods with approximate coordinates ──────────────────────
export const LOCATIONS = [
  { name: 'Waterside Market',    lat: 6.3010, lng: -10.7969 },
  { name: 'Paynesville',         lat: 6.3156, lng: -10.7608 },
  { name: 'Red Light Market',    lat: 6.3215, lng: -10.7573 },
  { name: 'Capitol Building',    lat: 6.2992, lng: -10.7969 },
  { name: 'Elwa Junction',       lat: 6.3024, lng: -10.8202 },
  { name: 'Free Port',           lat: 6.3248, lng: -10.7929 },
  { name: 'Congo Town',          lat: 6.3285, lng: -10.8034 },
  { name: 'Old Road',            lat: 6.3181, lng: -10.8104 },
  { name: 'Sinkor',              lat: 6.3012, lng: -10.7751 },
  { name: 'Broad Street',        lat: 6.3010, lng: -10.8006 },
  { name: 'Mamba Point',         lat: 6.3022, lng: -10.8066 },
  { name: 'Monrovia City Hall',  lat: 6.2998, lng: -10.7995 },
  { name: 'SKD Sports Complex',  lat: 6.3098, lng: -10.7821 },
  { name: 'JFK Hospital',        lat: 6.3012, lng: -10.7865 },
  { name: 'ELWA Hospital',       lat: 6.3024, lng: -10.8220 },
  { name: 'Duport Road',         lat: 6.3340, lng: -10.7502 },
  { name: 'Brewerville',         lat: 6.3561, lng: -10.7368 },
  { name: 'New Kru Town',        lat: 6.3320, lng: -10.7988 },
  { name: 'Logan Town',          lat: 6.3125, lng: -10.7699 },
  { name: 'Chocolate City',      lat: 6.3072, lng: -10.7640 },
];

export function locationByName(name) {
  return LOCATIONS.find(l => l.name === name) || LOCATIONS[0];
}

// ── Formatting ────────────────────────────────────────────────────────────────
export function fmtDate(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function fmtPhone(phone) {
  return phone.startsWith('+') ? phone : `+231${phone.replace(/^0/, '')}`;
}

// ── OTP ───────────────────────────────────────────────────────────────────────
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
