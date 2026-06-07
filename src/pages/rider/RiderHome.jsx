import { useState, useEffect, useCallback } from 'react';
import { Bike, MapPin, DollarSign, Star, CheckCircle, XCircle, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import * as db from '../../lib/db';

export default function RiderHome() {
  const { user, activeTrip, setActiveTrip, acceptTrip, declineTrip, advanceTripStatus, getMyTrips } = useApp();
  const [online,   setOnline]   = useState(false);
  const [pending,  setPending]  = useState(null);
  const [declined, setDeclined] = useState(false);

  const myTrips = getMyTrips();
  const todayTrips    = myTrips.filter(t => t.status === 'completed');
  const todayEarnings = todayTrips.reduce((s, t) => s + t.fare * 0.8, 0);

  // Poll for pending requests when online
  useEffect(() => {
    if (!online || activeTrip) { setPending(null); return; }
    const interval = setInterval(() => {
      const trip = db.getPendingTrip();
      if (trip && !declined) setPending(trip);
      else if (!trip)        setPending(null);
    }, 1500);
    return () => clearInterval(interval);
  }, [online, activeTrip, declined]);

  function goOnline()  { setOnline(true);  setDeclined(false); }
  function goOffline() { setOnline(false); setPending(null); }

  function accept() {
    if (!pending) return;
    acceptTrip(pending.id);
    setPending(null);
  }

  function decline() {
    setPending(null);
    setDeclined(true);
    setTimeout(() => setDeclined(false), 10000);
  }

  const btnNext = {
    accepted: { label: "I've Arrived",  color: 'bg-orange-500 hover:bg-orange-600' },
    arrived:  { label: 'Start Trip',    color: 'bg-green-500 hover:bg-green-600'  },
    started:  { label: 'Complete Trip', color: 'bg-blue-500 hover:bg-blue-600'    },
  };

  return (
    <div className="relative min-h-screen">
      {/* Map */}
      <div className="relative h-[60vh] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
        <svg className="absolute inset-0 w-full h-full opacity-25">
          <line x1="0" y1="42%" x2="100%" y2="56%" stroke="#94a3b8" strokeWidth="3"/>
          <line x1="28%" y1="0" x2="44%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="62%" y1="0" x2="72%" y2="100%" stroke="#94a3b8" strokeWidth="2"/>
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-colors ${online ? 'bg-orange-500' : 'bg-gray-400'}`}>
            <Bike className="w-6 h-6 text-white" />
          </div>
          {online && <div className="w-14 h-14 bg-orange-400 opacity-20 rounded-full absolute -top-1 -left-1 animate-ping"></div>}
        </div>
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-3 flex items-center justify-between shadow">
            <div>
              <p className="text-xs text-gray-400 font-medium">Today's Earnings</p>
              <p className="font-bold text-gray-900">${todayEarnings.toFixed(2)} · {todayTrips.length} trips</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${online ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              {online ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-2xl px-5 pt-5 pb-6">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>

        {/* Incoming request */}
        {online && pending && !activeTrip && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-900">New Ride Request!</p>
              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium animate-pulse">NEW</span>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="font-medium text-gray-800">{pending.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-700 rounded-full"></div><span className="text-gray-700">{pending.destination}</span></div>
            </div>
            <div className="flex gap-4 text-sm mb-4">
              <span className="flex items-center gap-1 text-gray-500"><MapPin className="w-3.5 h-3.5" />{pending.distance} km</span>
              <span className="flex items-center gap-1 text-gray-500"><DollarSign className="w-3.5 h-3.5" />${pending.fare.toFixed(2)}</span>
              <span className="flex items-center gap-1 font-semibold text-green-600">You earn: ${(pending.fare * 0.8).toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={decline} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-semibold hover:bg-red-100">
                <XCircle className="w-5 h-5" /> Decline
              </button>
              <button onClick={accept} className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600">
                <CheckCircle className="w-5 h-5" /> Accept
              </button>
            </div>
          </div>
        )}

        {/* Active trip progress */}
        {activeTrip && ['accepted','arrived','started'].includes(activeTrip.status) && (
          <div className="border-2 border-orange-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${activeTrip.status === 'started' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
              <p className="font-bold text-gray-900">
                {activeTrip.status === 'accepted' && 'Head to pickup location'}
                {activeTrip.status === 'arrived'  && 'Waiting for passenger'}
                {activeTrip.status === 'started'  && 'Trip in progress'}
              </p>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-700">{activeTrip.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-700 rounded-full"></div><span className="text-gray-700">{activeTrip.destination}</span></div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400">Passenger</p>
                <p className="font-semibold text-gray-900 text-sm">{activeTrip.passengerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Fare</p>
                <p className="font-bold text-gray-900">${activeTrip.fare.toFixed(2)}</p>
                <p className="text-xs text-green-600 font-medium">+${(activeTrip.fare * 0.8).toFixed(2)} yours</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50">
                <Navigation className="w-4 h-4" /> Navigate
              </button>
              <button onClick={advanceTripStatus}
                className={`flex-1 py-2.5 text-white rounded-xl text-sm font-bold ${btnNext[activeTrip.status]?.color}`}>
                {btnNext[activeTrip.status]?.label}
              </button>
            </div>
          </div>
        )}

        {/* Online/Offline toggle */}
        {!activeTrip && (!pending || !online) && (
          <div className="text-center">
            {online ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-gray-600">You're online — looking for rides…</p>
                </div>
                <button onClick={goOffline} className="w-full py-3.5 border-2 border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors">
                  Go Offline
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">Go online to start receiving ride requests</p>
                <button onClick={goOnline}
                  className="w-full py-4 bg-orange-500 text-white rounded-xl font-extrabold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 active:scale-95 transition-all">
                  Go Online
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Earned',  value: `$${(user?.earnings || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
            { label: 'Trips',   value: user?.totalTrips || 0,                  icon: Bike,       color: 'text-orange-500' },
            { label: 'Rating',  value: user?.rating ? user.rating.toFixed(1) : '—', icon: Star,  color: 'text-yellow-400' },
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
