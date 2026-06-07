import { useState } from 'react';
import { MapPin, Search, Bike, Star, Clock, ChevronRight, X, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockRiders } from '../../data/mockData';

const POPULAR = ['Waterside Market', 'Paynesville', 'Red Light Market', 'Capitol Building', 'Elwa Junction', 'Free Port', 'Congo Town', 'Old Road'];

const TRIP_STATUS = { idle: 'idle', searching: 'searching', matched: 'matched', riding: 'riding', done: 'done' };

function FareCard({ pickup, destination, onConfirm, onCancel }) {
  const fare = (Math.random() * 3 + 1.5).toFixed(2);
  const dist = (Math.random() * 5 + 1).toFixed(1);
  const eta  = Math.floor(Math.random() * 8 + 2);
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Fare Estimate</h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
          <span className="truncate">{pickup}</span>
        </div>
        <div className="w-px h-4 bg-gray-200 ml-1"></div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0"></div>
          <span className="truncate">{destination}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 mb-4 text-center">
        <div><p className="text-lg font-bold text-gray-900">${fare}</p><p className="text-xs text-gray-400">Fare</p></div>
        <div><p className="text-lg font-bold text-gray-900">{dist} km</p><p className="text-xs text-gray-400">Distance</p></div>
        <div><p className="text-lg font-bold text-gray-900">{eta} min</p><p className="text-xs text-gray-400">ETA</p></div>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} className="flex-2 flex-grow py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600">Confirm Ride</button>
      </div>
    </div>
  );
}

function RiderCard({ rider, onCancel }) {
  const [progress, setProgress] = useState(0);
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Rider on the way</h3>
        <span className="text-xs bg-green-100 text-green-600 px-2.5 py-0.5 rounded-full font-medium">3 min away</span>
      </div>
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-500">
          {rider.name[0]}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{rider.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-500">{rider.rating} · {rider.totalTrips} trips</span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{rider.motorcycle} · <span className="font-medium text-gray-600">{rider.plate}</span></p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Clock className="w-4 h-4" /> Call Rider
        </button>
        <button onClick={onCancel} className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50">Cancel</button>
      </div>
    </div>
  );
}

export default function PassengerHome() {
  const { user } = useApp();
  const [destination, setDestination] = useState('');
  const [pickup] = useState('Current Location');
  const [tripState, setTripState] = useState(TRIP_STATUS.idle);
  const [matchedRider, setMatchedRider] = useState(null);
  const [showFare, setShowFare] = useState(false);
  const [search, setSearch] = useState('');

  const nearbyRiders = mockRiders.filter(r => r.status === 'approved').slice(0, 3);
  const filtered = POPULAR.filter(p => p.toLowerCase().includes(search.toLowerCase()));

  function selectDestination(dest) {
    setDestination(dest);
    setSearch('');
    setShowFare(true);
    setTripState(TRIP_STATUS.idle);
  }

  function confirmRide() {
    setShowFare(false);
    setTripState(TRIP_STATUS.searching);
    setTimeout(() => {
      const rider = nearbyRiders[0];
      setMatchedRider(rider);
      setTripState(TRIP_STATUS.matched);
    }, 2000);
  }

  function cancelRide() {
    setTripState(TRIP_STATUS.idle);
    setMatchedRider(null);
    setDestination('');
    setShowFare(false);
  }

  return (
    <div className="relative min-h-screen">
      {/* Map placeholder */}
      <div className="relative h-[55vh] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {/* Fake map grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Fake roads */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <line x1="0" y1="40%" x2="100%" y2="55%" stroke="#94a3b8" strokeWidth="3"/>
          <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="60%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="0" y1="70%" x2="100%" y2="65%" stroke="#94a3b8" strokeWidth="3"/>
        </svg>
        {/* Rider pins */}
        {nearbyRiders.map((r, i) => (
          <div key={r.id} className="absolute" style={{ left: `${20 + i * 25}%`, top: `${30 + i * 10}%` }}>
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse">
              <Bike className="w-4 h-4" />
            </div>
          </div>
        ))}
        {/* Current location pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
          <div className="w-10 h-10 bg-blue-500 opacity-20 rounded-full absolute -top-3 -left-3 animate-ping"></div>
        </div>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700">{nearbyRiders.length} riders nearby</span>
            </div>
            <div className="bg-white rounded-xl px-3 py-1.5 shadow">
              <span className="text-xs font-medium text-gray-700">Hi, {user?.name?.split(' ')[0]} 👋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-2xl min-h-[45vh] px-5 pt-5 pb-6">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>

        {tripState === TRIP_STATUS.idle && !showFare && (
          <>
            {/* Search destination */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Where to?"
                className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Current location */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Navigation className="w-4 h-4 text-blue-500" />
              <span>Sinkor, Monrovia (your location)</span>
            </div>

            {/* Results */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{search ? 'Results' : 'Popular Destinations'}</p>
            <div className="space-y-1">
              {(search ? filtered : POPULAR.slice(0, 5)).map(dest => (
                <button
                  key={dest}
                  onClick={() => selectDestination(dest)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{dest}</p>
                    <p className="text-xs text-gray-400">Monrovia, Liberia</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          </>
        )}

        {tripState === TRIP_STATUS.idle && showFare && (
          <FareCard pickup={pickup} destination={destination} onConfirm={confirmRide} onCancel={cancelRide} />
        )}

        {tripState === TRIP_STATUS.searching && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <Bike className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Finding your rider…</h3>
            <p className="text-sm text-gray-400">Looking for nearby available riders</p>
            <button onClick={cancelRide} className="mt-6 text-sm text-red-500 hover:underline">Cancel</button>
          </div>
        )}

        {tripState === TRIP_STATUS.matched && matchedRider && (
          <RiderCard rider={matchedRider} onCancel={cancelRide} />
        )}
      </div>
    </div>
  );
}
