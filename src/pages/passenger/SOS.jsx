import { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Share2 } from 'lucide-react';

export default function SOS() {
  const [activated, setActivated] = useState(false);
  const [held, setHeld] = useState(false);

  function activateSOS() {
    setActivated(true);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Safety & SOS</h1>
      <p className="text-sm text-gray-400 mb-8">Hold the SOS button for 3 seconds to alert your emergency contacts and our support team.</p>

      {/* SOS Button */}
      <div className="flex justify-center mb-10">
        <div className="relative">
          {activated && (
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping scale-110"></div>
          )}
          <button
            onMouseDown={() => setHeld(true)}
            onMouseUp={() => setHeld(false)}
            onTouchStart={() => setHeld(true)}
            onTouchEnd={() => setHeld(false)}
            onClick={activateSOS}
            className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 ${activated ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            <AlertTriangle className="w-12 h-12 text-white" />
            <span className="text-white font-extrabold text-xl tracking-widest">SOS</span>
          </button>
        </div>
      </div>

      {activated && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 text-center">
          <p className="font-bold text-red-700 mb-1">🚨 SOS Activated</p>
          <p className="text-sm text-red-600">Your live location has been shared with emergency contacts and our support team.</p>
          <button onClick={() => setActivated(false)} className="mt-3 text-sm text-red-500 hover:underline font-medium">Cancel SOS</button>
        </div>
      )}

      {/* Safety features */}
      <div className="space-y-3">
        {[
          { icon: MapPin, color: 'bg-blue-50 text-blue-500', title: 'Share Live Location', desc: 'Share your trip link with family or friends', action: 'Share' },
          { icon: Phone, color: 'bg-green-50 text-green-500', title: 'Call Emergency Contact', desc: 'Fatou Kamara · +231 77 300 0011', action: 'Call' },
          { icon: Share2, color: 'bg-purple-50 text-purple-500', title: 'Share Trip Link', desc: 'Let someone track your ride in real-time', action: 'Share' },
        ].map(({ icon: Icon, color, title, desc, action }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <button className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100">{action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
