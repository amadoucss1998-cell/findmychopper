import { useState } from 'react';
import { Bike, MapPin, DollarSign, Star, CheckCircle, XCircle, Navigation, Clock } from 'lucide-react';

const MOCK_REQUEST = {
  id: 'R-008',
  passenger: 'Aminata Bah',
  pickup: 'Congo Town Junction',
  destination: 'Elwa Junction',
  distance: '2.4 km',
  fare: '$1.80',
  eta: '4 min',
};

export default function RiderHome() {
  const [online, setOnline] = useState(false);
  const [request, setRequest] = useState(null);
  const [tripState, setTripState] = useState('idle'); // idle | accepted | arrived | started
  const [todayEarnings] = useState(18.50);
  const [todayTrips] = useState(8);

  function goOnline() {
    setOnline(true);
    // Simulate incoming request after 3s
    setTimeout(() => setRequest(MOCK_REQUEST), 3000);
  }

  function goOffline() {
    setOnline(false);
    setRequest(null);
    setTripState('idle');
  }

  function acceptRide() {
    setRequest(null);
    setTripState('accepted');
  }

  function declineRide() {
    setRequest(null);
    setTripState('idle');
  }

  function markArrived() { setTripState('arrived'); }
  function startTrip() { setTripState('started'); }
  function completeTrip() { setTripState('idle'); }

  return (
    <div className="relative min-h-screen">
      {/* Map */}
      <div className="relative h-[60vh] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <line x1="0" y1="40%" x2="100%" y2="55%" stroke="#94a3b8" strokeWidth="3"/>
          <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="60%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
        </svg>

        {/* Rider pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center ${online ? 'bg-orange-500' : 'bg-gray-400'}`}>
            <Bike className="w-6 h-6 text-white" />
          </div>
          {online && <div className="w-14 h-14 bg-orange-400 opacity-20 rounded-full absolute -top-1 -left-1 animate-ping"></div>}
        </div>

        {/* Status bar */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-3 flex items-center justify-between shadow">
            <div>
              <p className="text-xs text-gray-400 font-medium">Today</p>
              <p className="font-bold text-gray-900">${todayEarnings.toFixed(2)} · {todayTrips} trips</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${online ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {online ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-2xl px-5 pt-5 pb-6">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>

        {/* Incoming request */}
        {request && online && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-900">New Ride Request!</p>
              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">15s</span>
            </div>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-600">{request.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-700 rounded-full"></div><span className="text-gray-600">{request.destination}</span></div>
            </div>
            <div className="flex gap-3 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{request.distance}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{request.fare}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{request.eta}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={declineRide} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-semibold hover:bg-red-100">
                <XCircle className="w-5 h-5" /> Decline
              </button>
              <button onClick={acceptRide} className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600">
                <CheckCircle className="w-5 h-5" /> Accept
              </button>
            </div>
          </div>
        )}

        {/* Active trip */}
        {tripState !== 'idle' && (
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${tripState === 'started' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
              <p className="font-bold text-gray-900 capitalize">
                {tripState === 'accepted' && 'Head to Pickup'}
                {tripState === 'arrived' && 'Waiting for Passenger'}
                {tripState === 'started' && 'Trip in Progress'}
              </p>
            </div>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-600">{MOCK_REQUEST.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-700 rounded-full"></div><span className="text-gray-600">{MOCK_REQUEST.destination}</span></div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Passenger: <span className="font-medium text-gray-800">{MOCK_REQUEST.passenger}</span></span>
              <span className="font-bold text-gray-900">{MOCK_REQUEST.fare}</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" /> Navigate
              </button>
              {tripState === 'accepted' && (
                <button onClick={markArrived} className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600">
                  I've Arrived
                </button>
              )}
              {tripState === 'arrived' && (
                <button onClick={startTrip} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600">
                  Start Trip
                </button>
              )}
              {tripState === 'started' && (
                <button onClick={completeTrip} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600">
                  Complete Trip
                </button>
              )}
            </div>
          </div>
        )}

        {/* Online/Offline toggle */}
        {tripState === 'idle' && !request && (
          <div className="text-center">
            {online ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-gray-600">You're online — waiting for requests…</p>
                </div>
                <button onClick={goOffline} className="w-full py-3.5 border-2 border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors">
                  Go Offline
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">Go online to start receiving ride requests</p>
                <button onClick={goOnline} className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95">
                  Go Online
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Today', value: `$${todayEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
            { label: 'Trips', value: todayTrips, icon: Bike, color: 'text-orange-500' },
            { label: 'Rating', value: '4.8', icon: Star, color: 'text-yellow-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <p className="font-bold text-gray-900 text-sm">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
