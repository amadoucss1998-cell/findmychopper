import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Monrovia, Liberia center
const MONROVIA = [6.3005, -10.7969];

function makeIcon(color = 'orange', size = 36) {
  const colors = {
    orange: '#f97316',
    blue:   '#3b82f6',
    green:  '#22c55e',
    red:    '#ef4444',
    gray:   '#6b7280',
  };
  const c = colors[color] || color;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 36 46">
      <circle cx="18" cy="18" r="18" fill="${c}" opacity="0.15"/>
      <circle cx="18" cy="18" r="12" fill="${c}"/>
      <circle cx="18" cy="18" r="5" fill="white"/>
      <line x1="18" y1="30" x2="18" y2="46" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3],
    popupAnchor:[0, -size * 1.3],
  });
}

function makeBikeIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="18" fill="#f97316"/>
      <text x="18" y="23" text-anchor="middle" font-size="16" fill="white">🏍</text>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });
}

async function fetchRoute(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]) {
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
  } catch {}
  // Fallback: straight line
  return [from, to];
}

// ── Main Map component ────────────────────────────────────────────────────────
const AppMap = forwardRef(function AppMap({
  center        = MONROVIA,
  zoom          = 14,
  pickup        = null,   // [lat, lng]
  destination   = null,   // [lat, lng]
  riderLocations= [],     // [{ lat, lng, name }]
  showRoute     = false,
  onMapClick    = null,
  height        = '55vh',
  className     = '',
}, ref) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const layersRef    = useRef({ pickup: null, dest: null, route: null, riders: [] });

  // Expose flyTo to parent
  useImperativeHandle(ref, () => ({
    flyTo: (latlng, z = 15) => mapRef.current?.flyTo(latlng, z, { duration: 1.2 }),
  }));

  // Init map once
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: false }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    L.control.attribution({ prefix: '© OpenStreetMap' }).addTo(map);
    mapRef.current = map;
    if (onMapClick) map.on('click', e => onMapClick([e.latlng.lat, e.latlng.lng]));
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Pickup marker
  useEffect(() => {
    if (!mapRef.current) return;
    layersRef.current.pickup?.remove();
    if (pickup) {
      layersRef.current.pickup = L.marker(pickup, { icon: makeIcon('blue') })
        .bindPopup('📍 Pickup').addTo(mapRef.current);
    }
  }, [pickup?.[0], pickup?.[1]]);

  // Destination marker
  useEffect(() => {
    if (!mapRef.current) return;
    layersRef.current.dest?.remove();
    if (destination) {
      layersRef.current.dest = L.marker(destination, { icon: makeIcon('gray') })
        .bindPopup('🏁 Destination').addTo(mapRef.current);
    }
  }, [destination?.[0], destination?.[1]]);

  // Route polyline
  useEffect(() => {
    if (!mapRef.current) return;
    layersRef.current.route?.remove();
    if (!showRoute || !pickup || !destination) return;

    fetchRoute(pickup, destination).then(coords => {
      if (!mapRef.current) return;
      layersRef.current.route = L.polyline(coords, {
        color: '#f97316', weight: 4, opacity: 0.8, dashArray: null,
      }).addTo(mapRef.current);
      mapRef.current.fitBounds(L.latLngBounds([pickup, destination]).pad(0.25));
    });
  }, [showRoute, pickup?.[0], pickup?.[1], destination?.[0], destination?.[1]]);

  // Rider markers
  useEffect(() => {
    if (!mapRef.current) return;
    layersRef.current.riders.forEach(m => m.remove());
    layersRef.current.riders = riderLocations.map(({ lat, lng, name }) =>
      L.marker([lat, lng], { icon: makeBikeIcon() })
        .bindPopup(`🏍 ${name || 'Rider'}`)
        .addTo(mapRef.current)
    );
  }, [JSON.stringify(riderLocations)]);

  return <div ref={containerRef} style={{ height }} className={`w-full z-0 ${className}`} />;
});

export default AppMap;
export { MONROVIA, makeIcon, fetchRoute };
