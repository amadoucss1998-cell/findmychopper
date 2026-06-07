import { useState } from 'react';
import { MapPin, Search, Bike, Star, Clock, X, Navigation, Phone, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const POPULAR = ['Waterside Market', 'Paynesville', 'Red Light Market', 'Capitol Building', 'Elwa Junction', 'Free Port', 'Congo Town', 'Old Road'];

function FareCard({ pickup, destination, onConfirm, onCancel }) {
  const fare     = parseFloat((Math.random() * 3 + 1.5).toFixed(2));
  const distance = parseFloat((Math.random() * 5 + 1).toFixed(1));
  const eta      = Math.floor(Math.random() * 8 + 2);
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Fare Estimate</h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="truncate">{pickup}</span></div>
        <div className="w-px h-4 bg-gray-200 ml-1"></div>
        <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><span className="truncate">{destination}</span></div>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 mb-4 text-center">
        <div><p className="text-lg font-bold text-gray-900">${fare.toFixed(2)}</p><p className="text-xs text-gray-400">Fare</p></div>
        <div><p className="text-lg font-bold text-gray-900">{distance} km</p><p className="text-xs text-gray-400">Distance</p></div>
        <div><p className="text-lg font-bold text-gray-900">{eta} min</p><p className="text-xs text-gray-400">ETA</p></div>
      </div>
      <p className="text-xs text-gray-400 text-center mb-3">Base $0.50 + $0.20/km + $0.05/min</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={() => onConfirm({ fare, distance, eta })} className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600">Confirm Ride</button>
      </div>
    </div>
  );
}

function SearchingCard({ onCancel }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
        <Bike className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">Finding your rider…</h3>
      <p className="text-sm text-gray-400">Looking for nearby available riders</p>
      <button onClick={onCancel} className="mt-6 text-sm text-red-500 hover:underline font-medium">Cancel</button>
    </div>
  );
}

function ActiveRideCard({ trip, onCancel }) {
  const { rider } = trip;
  const statusLabel = {
    accepted: { text: 'Rider on the way', dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-600', badgeText: '~3 min away' },
    arrived:  { text: 'Rider has arrived!', dot: 'bg-green-500 animate-pulse', badge: 'bg-green-100 text-green-600', badgeText: 'Waiting for you' },
    started:  { text: 'Trip in progress', dot: 'bg-blue-500 animate-pulse', badge: 'bg-blue-100 text-blue-600', badgeText: 'On your way' },
    completed:{ text: 'Trip completed!', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600', badgeText: 'Arrived' },
  };
  const s = statusLabel[trip.status] || statusLabel.accepted;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></div>
        <p className="font-bold text-gray-900">{s.text}</p>
        <span className={`ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium ${s.badge}`}>{s.badgeText}</span>
      </div>

      {rider && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl font-bold text-orange-500">{rider.name[0]}</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{rider.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-500">{rider.rating} · {rider.totalTrips} trips</span>
            </div>
            <p className="text-sm text-gray-400">{rider.motorcycle} · <span className="font-medium text-gray-700">{rider.plate}</span></p>
          </div>
        </div>
      )}

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span>{trip.pickup}</span></div>
        <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><span>{trip.destination}</span></div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Fare</span>
        <span className="font-bold text-gray-900">${trip.fare.toFixed(2)}</span>
      </div>

      {trip.status !== 'completed' && (
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Phone className="w-4 h-4" /> Call Rider
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50">Cancel</button>
        </div>
      )}
    </div>
  );
}

export default function PassengerHome() {
  const { user, riders, activeTrip, requestRide, cancelRide } = useApp();
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [showFare, setShowFare] = useState(false);

  const nearbyCount = riders.filter(r => r.status === 'approved').length;
  const filtered = POPULAR.filter(p => p.toLowerCase().includes(search.toLowerCase()));

  function selectDestination(dest) {
    setDestination(dest);
    setSearch('');
    setShowFare(true);
  }

  function confirmRide({ fare, distance, eta }) {
    setShowFare(false);
    requestRide({ pickup: 'Sinkor, Monrovia', destination, fare, distance, eta });
  }

  function handleCancel() {
    cancelRide();
    setShowFare(false);
    setDestination('');
  }

  const isIdle = !activeTrip && !showFare;

  return (
    <div className="relative min-h-screen">
      {/* Map */}
      <div className="relative h-[55vh] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <line x1="0" y1="40%" x2="100%" y2="55%" stroke="#94a3b8" strokeWidth="3"/>
          <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="60%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="0" y1="70%" x2="100%" y2="65%" stroke="#94a3b8" strokeWidth="3"/>
        </svg>

        {/* Rider pins */}
        {riders.filter(r => r.status === 'approved').slice(0, 3).map((r, i) => (
          <div key={r.id} className="absolute" style={{ left: `${20 + i * 25}%`, top: `${30 + i * 10}%` }}>
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              <Bike className="w-4 h-4" />
            </div>
          </div>
        ))}
        {/* You */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
          <div className="w-10 h-10 bg-blue-500 opacity-20 rounded-full absolute -top-3 -left-3 animate-ping"></div>
        </div>

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">{nearbyCount} riders nearby</span>
          </div>
          <div className="bg-white rounded-xl px-3 py-1.5 shadow">
            <span className="text-xs font-medium text-gray-700">Hi, {user?.name?.split(' ')[0]} 👋</span>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-2xl min-h-[45vh] px-5 pt-5 pb-6">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>

        {/* Idle: search */}
        {isIdle && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Where to?"
                className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Navigation className="w-4 h-4 text-blue-500" />
              <span>Sinkor, Monrovia (your location)</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {search ? 'Results' : 'Popular Destinations'}
            </p>
            <div className="space-y-1">
              {(search ? filtered : POPULAR.slice(0, 5)).map(dest => (
                <button key={dest} onClick={() => selectDestination(dest)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-xl transition-colors text-left">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{dest}</p>
                    <p className="text-xs text-gray-400">Monrovia, Liberia</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Fare estimate */}
        {!activeTrip && showFare && (
          <FareCard pickup="Sinkor, Monrovia" destination={destination} onConfirm={confirmRide} onCancel={handleCancel} />
        )}

        {/* Searching */}
        {activeTrip?.status === 'requested' && (
          <SearchingCard onCancel={handleCancel} />
        )}

        {/* Active ride */}
        {activeTrip && activeTrip.status !== 'requested' && (
          <ActiveRideCard trip={activeTrip} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
}
