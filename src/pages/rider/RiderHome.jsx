import { useState, useEffect } from 'react';
import { Bike, MapPin, DollarSign, Star, CheckCircle, XCircle, Navigation, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RiderHome() {
  const { activeTrip, acceptRide, declineRide, advanceTripStatus, cancelRide, riderOnline, toggleOnline, riders, user, trips } = useApp();
  const rider = riders.find(r => r.id === (user?.riderId || '1')) || riders[0];

  const todayTrips = trips.filter(t => t.riderId === rider?.id && t.status === 'completed').slice(-8);
  const todayEarnings = todayTrips.reduce((s, t) => s + t.fare * 0.8, 0);

  // Pending request = trip in 'requested' state (passenger booked, waiting for rider)
  const pendingRequest = activeTrip?.status === 'requested' ? activeTrip : null;
  const myActiveTrip   = activeTrip && activeTrip.status !== 'requested' ? activeTrip : null;

  const btnLabel = {
    accepted: { label: "I've Arrived", next: advanceTripStatus, color: 'bg-orange-500 hover:bg-orange-600' },
    arrived:  { label: 'Start Trip',   next: advanceTripStatus, color: 'bg-green-500 hover:bg-green-600' },
    started:  { label: 'Complete Trip',next: advanceTripStatus, color: 'bg-blue-500 hover:bg-blue-600' },
  };
  const btn = myActiveTrip ? btnLabel[myActiveTrip.status] : null;

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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center ${riderOnline ? 'bg-orange-500' : 'bg-gray-400'}`}>
            <Bike className="w-6 h-6 text-white" />
          </div>
          {riderOnline && <div className="w-14 h-14 bg-orange-400 opacity-20 rounded-full absolute -top-1 -left-1 animate-ping"></div>}
        </div>
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-3 flex items-center justify-between shadow">
            <div>
              <p className="text-xs text-gray-400">Today</p>
              <p className="font-bold text-gray-900">${todayEarnings.toFixed(2)} · {todayTrips.length} trips</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${riderOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${riderOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {riderOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-2xl px-5 pt-5 pb-6">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>

        {/* Incoming request */}
        {pendingRequest && riderOnline && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-900 text-base">New Ride Request!</p>
              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium animate-pulse">NEW</span>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-700 font-medium">{pendingRequest.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-700 rounded-full"></div><span className="text-gray-700">{pendingRequest.destination}</span></div>
            </div>
            <div className="flex gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{pendingRequest.distance} km</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${pendingRequest.fare.toFixed(2)}</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">You earn: ${(pendingRequest.fare * 0.8).toFixed(2)}</span>
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
        {myActiveTrip && (
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${myActiveTrip.status === 'started' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
              <p className="font-bold text-gray-900">
                {myActiveTrip.status === 'accepted' && 'Head to Pickup'}
                {myActiveTrip.status === 'arrived'  && 'Waiting for Passenger'}
                {myActiveTrip.status === 'started'  && 'Trip in Progress'}
                {myActiveTrip.status === 'completed' && 'Trip Completed ✓'}
              </p>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-600">{myActiveTrip.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-700 rounded-full"></div><span className="text-gray-600">{myActiveTrip.destination}</span></div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Passenger: <span className="font-medium text-gray-800">{myActiveTrip.passengerName}</span></span>
              <div className="text-right">
                <span className="font-bold text-gray-900">${myActiveTrip.fare.toFixed(2)}</span>
                <p className="text-xs text-green-600">You get: ${(myActiveTrip.fare * 0.8).toFixed(2)}</p>
              </div>
            </div>
            {btn && (
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50">
                  <Navigation className="w-4 h-4" /> Navigate
                </button>
                <button onClick={btn.next} className={`flex-1 py-2.5 text-white rounded-xl text-sm font-bold ${btn.color}`}>
                  {btn.label}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Online/Offline */}
        {!pendingRequest && !myActiveTrip && (
          <div className="text-center">
            {riderOnline ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-gray-600">Online — waiting for requests…</p>
                </div>
                <button onClick={() => toggleOnline(false)} className="w-full py-3.5 border-2 border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50">Go Offline</button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">Go online to start receiving ride requests</p>
                <button onClick={() => toggleOnline(true)} className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 active:scale-95 transition-all">
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
            { label: 'Trips', value: rider?.totalTrips || 0, icon: Bike, color: 'text-orange-500' },
            { label: 'Rating', value: rider?.rating || '—', icon: Star, color: 'text-yellow-400' },
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
