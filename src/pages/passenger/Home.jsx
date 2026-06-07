import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Bike, Star, Phone, X, Navigation, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOCATIONS, calcFare, haversine, locationByName } from '../../lib/utils';
import AppMap, { MONROVIA } from '../../components/Map';

const PICKUP_NAME = 'Sinkor';

// Scatter nearby riders around Monrovia for display
function scatterRiders(riders) {
  return riders.map((r, i) => {
    const angle  = (i * 137.5) * Math.PI / 180;
    const radius = 0.005 + (i % 3) * 0.003;
    return { lat: MONROVIA[0] + Math.cos(angle) * radius, lng: MONROVIA[1] + Math.sin(angle) * radius, name: r.name };
  });
}

function FareEstimate({ pickup, destination, dist, dur, fare, onConfirm, onCancel }) {
  return (
    <div>
      <h3 className="font-bold text-gray-900 text-base mb-4">Fare Estimate</h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full flex-shrink-0"></div>
          <span className="font-medium">{pickup}</span>
        </div>
        <div className="w-px h-4 bg-gray-200 ml-1"></div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2.5 h-2.5 bg-gray-800 rounded-full flex-shrink-0"></div>
          <span className="font-medium">{destination}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-orange-50 rounded-xl p-3 mb-3 text-center">
        <div><p className="text-xl font-extrabold text-gray-900">${fare.toFixed(2)}</p><p className="text-xs text-gray-400">Fare</p></div>
        <div><p className="text-xl font-extrabold text-gray-900">{dist} km</p><p className="text-xs text-gray-400">Distance</p></div>
        <div><p className="text-xl font-extrabold text-gray-900">{dur} min</p><p className="text-xs text-gray-400">ETA</p></div>
      </div>
      <p className="text-xs text-gray-400 text-center mb-4">$0.50 base + $0.20/km + $0.05/min · Cash payment</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} className="flex-[2] py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600">Confirm Ride</button>
      </div>
    </div>
  );
}

function SearchingCard({ onCancel }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
        <Bike className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="font-bold text-gray-900 mb-1">Finding your rider…</h3>
      <p className="text-sm text-gray-400 mb-1">Looking for available riders nearby</p>
      <button onClick={onCancel} className="mt-5 text-sm text-red-500 hover:underline">Cancel</button>
    </div>
  );
}

function RiderCard({ trip, onCancel }) {
  const cfg = {
    accepted: { label: 'Rider on the way',  badge: 'bg-orange-100 text-orange-600', badgeText: '~3 min away',       dot: 'bg-orange-500'                   },
    arrived:  { label: 'Rider has arrived!', badge: 'bg-green-100 text-green-700',  badgeText: 'Look for your rider', dot: 'bg-green-500 animate-pulse'       },
    started:  { label: 'Trip in progress',  badge: 'bg-blue-100 text-blue-700',     badgeText: 'On your way',         dot: 'bg-blue-500 animate-pulse'         },
  };
  const s = cfg[trip.status] || cfg.accepted;
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></div>
        <p className="font-bold text-gray-900">{s.label}</p>
        <span className={`ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium ${s.badge}`}>{s.badgeText}</span>
      </div>
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl font-bold text-orange-500 flex-shrink-0">
          {trip.riderName?.[0] || '?'}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{trip.riderName}</p>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
            {trip.riderRating > 0 && <><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /><span>{trip.riderRating}</span><span className="text-gray-300 mx-1">·</span></>}
            <span>{trip.riderMotorcycle}</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{trip.riderPlate}</p>
        </div>
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div><span>{trip.pickup}</span></div>
        <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div><span>{trip.destination}</span></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Fare</span>
        <span className="font-extrabold text-gray-900 text-lg">${trip.fare.toFixed(2)}</span>
      </div>
      {trip.status !== 'started' && (
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Phone className="w-4 h-4" /> Call Rider
          </button>
          {trip.status === 'accepted' && (
            <button onClick={onCancel} className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50">Cancel</button>
          )}
        </div>
      )}
    </div>
  );
}

function RatingCard({ trip, onSubmit }) {
  const [score, setScore]     = useState(5);
  const [comment, setComment] = useState('');
  const [hov, setHov]         = useState(0);
  return (
    <div>
      <h3 className="font-bold text-gray-900 text-base mb-1">Trip Complete! 🎉</h3>
      <p className="text-sm text-gray-400 mb-4">How was your ride with {trip.riderName}?</p>
      <div className="flex justify-center gap-2 mb-4">
        {[1,2,3,4,5].map(s => (
          <button key={s} onMouseEnter={() => setHov(s)} onMouseLeave={() => setHov(0)} onClick={() => setScore(s)}>
            <Star className={`w-9 h-9 transition-colors ${s <= (hov || score) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Leave a comment (optional)"
        rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none mb-4" />
      <button onClick={() => onSubmit(score, comment)} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600">
        Submit Rating
      </button>
    </div>
  );
}

export default function PassengerHome() {
  const { user, activeTrip, requestRide, cancelTrip, submitPassengerRating, getAllRiders } = useApp();

  const [search,     setSearch]     = useState('');
  const [destName,   setDestName]   = useState('');
  const [showFare,   setShowFare]   = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [userPos,    setUserPos]    = useState(MONROVIA);
  const mapRef = useRef(null);

  const riders    = getAllRiders();
  const available = riders.filter(r => r.riderStatus === 'approved');

  // Get real geolocation once
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(latlng);
        mapRef.current?.flyTo(latlng, 14);
      },
      () => {} // silently fall back to Monrovia
    );
  }, []);

  // Detect trip completion
  useEffect(() => {
    if (activeTrip?.status === 'completed') setShowRating(true);
  }, [activeTrip?.status]);

  const filtered = LOCATIONS.filter(l =>
    l.name !== PICKUP_NAME && l.name.toLowerCase().includes(search.toLowerCase())
  );

  function selectDest(name) {
    setDestName(name);
    setSearch('');
    setShowFare(true);
    const loc = locationByName(name);
    mapRef.current?.flyTo([loc.lat, loc.lng], 14);
  }

  // Computed fare info
  const pickupLoc = locationByName(PICKUP_NAME);
  const destLoc   = destName ? locationByName(destName) : null;
  const dist      = destLoc ? haversine(pickupLoc.lat, pickupLoc.lng, destLoc.lat, destLoc.lng) : 0;
  const dur       = Math.round(dist / 0.3 + 2);
  const fare      = calcFare(dist, dur);

  function confirm() {
    setShowFare(false);
    requestRide({ pickup: PICKUP_NAME, destination: destName });
  }

  function cancel() {
    cancelTrip();
    setShowFare(false);
    setDestName('');
  }

  function submitRating(score, comment) {
    submitPassengerRating(score, comment);
    setShowRating(false);
    setDestName('');
  }

  const isIdle      = !activeTrip && !showFare && !showRating;
  const isSearching = activeTrip?.status === 'requested';
  const isActive    = activeTrip && !['requested','completed'].includes(activeTrip.status);

  // Map props
  const pickupCoords = [pickupLoc.lat, pickupLoc.lng];
  const destCoords   = destLoc ? [destLoc.lat, destLoc.lng] : null;
  const showRoute    = (showFare || isActive) && !!destCoords;
  const riderLocs    = isIdle ? scatterRiders(available) : [];

  // If trip is active, show rider at pickup approximation
  const activeRiderLoc = isActive && activeTrip?.riderId
    ? [{ lat: pickupLoc.lat + 0.002, lng: pickupLoc.lng + 0.001, name: activeTrip.riderName }]
    : [];

  return (
    <div className="relative flex flex-col h-screen">
      {/* Real Map */}
      <div className="relative flex-shrink-0" style={{ height: '52vh' }}>
        <AppMap
          ref={mapRef}
          center={userPos}
          zoom={14}
          pickup={pickupCoords}
          destination={destCoords}
          riderLocations={isActive ? activeRiderLoc : riderLocs}
          showRoute={showRoute}
          height="100%"
        />

        {/* Overlays */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow flex items-center gap-1.5 pointer-events-auto">
            <div className={`w-2 h-2 rounded-full ${available.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-xs font-medium text-gray-700">{available.length} available</span>
          </div>
          <div className="bg-white rounded-xl px-3 py-1.5 shadow pointer-events-auto">
            <span className="text-xs font-medium text-gray-700">Hi, {user?.name?.split(' ')[0]} 👋</span>
          </div>
        </div>

        {/* Active trip status bar */}
        {isActive && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="bg-white/95 backdrop-blur rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${activeTrip.status === 'started' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {activeTrip.status === 'accepted' && 'Rider is on the way…'}
                {activeTrip.status === 'arrived'  && 'Rider has arrived — look for your chopper!'}
                {activeTrip.status === 'started'  && `Heading to ${activeTrip.destination}…`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl -mt-5 relative z-10 shadow-2xl flex-1 overflow-y-auto px-5 pt-5 pb-24">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>

        {isIdle && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Where to?"
                className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Navigation className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{PICKUP_NAME}, Monrovia (your location)</span>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {search ? `Results for "${search}"` : 'Popular Destinations'}
            </p>
            {filtered.length === 0 && search && <p className="text-sm text-gray-400 py-4 text-center">No location found</p>}
            <div className="space-y-0.5">
              {(search ? filtered : filtered.slice(0, 7)).map(loc => (
                <button key={loc.name} onClick={() => selectDest(loc.name)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-xl transition-colors text-left">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{loc.name}</p>
                    <p className="text-xs text-gray-400">Monrovia, Liberia</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>

            {available.length === 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center">
                <p className="text-sm text-yellow-700 font-medium">No riders online right now</p>
                <p className="text-xs text-yellow-500 mt-0.5">Try again in a few minutes</p>
              </div>
            )}
          </>
        )}

        {showFare && !activeTrip && (
          <FareEstimate pickup={PICKUP_NAME} destination={destName} dist={dist} dur={dur} fare={fare} onConfirm={confirm} onCancel={cancel} />
        )}

        {isSearching && <SearchingCard onCancel={cancel} />}
        {isActive    && <RiderCard trip={activeTrip} onCancel={cancel} />}
        {showRating && activeTrip && <RatingCard trip={activeTrip} onSubmit={submitRating} />}
      </div>
    </div>
  );
}
