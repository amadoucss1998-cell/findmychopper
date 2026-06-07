import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function RiderTrips() {
  const { getMyTrips } = useApp();
  const [filter, setFilter] = useState('all');

  const trips    = getMyTrips();
  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">Trip History</h1>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',     value: trips.length },
          { label: 'Completed', value: trips.filter(t => t.status === 'completed').length },
          { label: 'Earned',    value: `$${trips.filter(t => t.status === 'completed').reduce((s,t) => s + t.fare * 0.8, 0).toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className="font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['all','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Clock} title="No trips yet" desc="Accept ride requests to see your trip history here." />
        : <div className="space-y-3">
            {filtered.map(trip => (
              <div key={trip.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">{fmtDate(trip.createdAt)}</p>
                    <div className="mt-1"><StatusBadge status={trip.status} /></div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${trip.fare.toFixed(2)}</p>
                    {trip.status === 'completed' && <p className="text-xs text-green-600 font-medium">+${(trip.fare * 0.8).toFixed(2)}</p>}
                  </div>
                </div>
                <div className="space-y-1.5 mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div><span>{trip.pickup}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-gray-700 rounded-full flex-shrink-0"></div><span>{trip.destination}</span></div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-400">
                  <span>Passenger: <span className="font-medium text-gray-700">{trip.passengerName}</span></span>
                  <span>{trip.distance} km</span>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
