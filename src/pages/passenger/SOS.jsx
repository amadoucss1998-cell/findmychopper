import { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Share2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SOS() {
  const { user, activeTrip } = useApp();
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(null);

  function startHold() {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(null);
        setActivated(true);
      } else {
        setCountdown(count);
      }
    }, 1000);
    return interval;
  }

  let holdTimer;
  function onMouseDown() { holdTimer = startHold(); }
  function onMouseUp()   { if (holdTimer) { clearInterval(holdTimer); } setCountdown(null); }

  const contacts = user?.emergencyContacts || [];
  const shareText = activeTrip
    ? `I'm in a FindMyChopper ride from ${activeTrip.pickup} to ${activeTrip.destination}. Rider: ${activeTrip.riderName} (${activeTrip.riderPlate})`
    : `I'm using FindMyChopper in Monrovia, Liberia.`;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Safety & SOS</h1>
      <p className="text-sm text-gray-400 mb-8">Hold the SOS button for 3 seconds to activate an emergency alert.</p>

      {/* SOS Button */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {activated && <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping scale-110"></div>}
          <button
            onMouseDown={onMouseDown} onMouseUp={onMouseUp}
            onTouchStart={onMouseDown} onTouchEnd={onMouseUp}
            className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 select-none ${activated ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}>
            <AlertTriangle className="w-12 h-12 text-white" />
            <span className="text-white font-extrabold text-xl tracking-widest">
              {countdown !== null ? countdown : 'SOS'}
            </span>
          </button>
        </div>
      </div>

      {activated && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-center relative">
          <button onClick={() => setActivated(false)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><X className="w-4 h-4" /></button>
          <p className="font-bold text-red-700 mb-1">🚨 SOS Activated</p>
          <p className="text-sm text-red-600">Your location has been shared with emergency contacts and FindMyChopper support.</p>
        </div>
      )}

      <div className="space-y-3">
        {contacts.length > 0 && contacts.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-green-500" /></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{c.name}</p>
              <p className="text-xs text-gray-400">{c.relation} · {c.phone}</p>
            </div>
            <a href={`tel:${c.phone}`} className="text-xs font-semibold text-green-500 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100">Call</a>
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-blue-500" /></div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">Live Location</p>
            <p className="text-xs text-gray-400">{activeTrip ? `In trip: ${activeTrip.pickup} → ${activeTrip.destination}` : 'No active trip'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0"><Share2 className="w-5 h-5 text-purple-500" /></div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">Share Trip Info</p>
            <p className="text-xs text-gray-400 truncate">{shareText.slice(0, 50)}…</p>
          </div>
          <button onClick={() => navigator.clipboard?.writeText(shareText)}
            className="text-xs font-semibold text-purple-500 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100">Copy</button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-red-500" /></div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">Liberia Emergency</p>
            <p className="text-xs text-gray-400">Police · Fire · Medical</p>
          </div>
          <a href="tel:911" className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">Call 911</a>
        </div>
      </div>
    </div>
  );
}
