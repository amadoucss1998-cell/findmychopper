import { useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

function TripDetail({ trip, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6 pb-8 max-h-[80vh] overflow-y-auto">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Receipt</h3>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 px-2 py-1">Close</button>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-700">{trip.pickup}</span></div>
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><span className="text-gray-700">{trip.destination}</span></div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Rider',    value: trip.riderName || 'Unassigned' },
            { label: 'Date',     value: fmtDate(trip.createdAt) },
            { label: 'Distance', value: `${trip.distance} km` },
            { label: 'Duration', value: `~${trip.duration} min` },
            { label: 'Status',   value: <StatusBadge status={trip.status} /> },
          ].map(({ label, value }) => (
            <div key={label}><p className="text-gray-400 text-xs mb-0.5">{label}</p><div className="font-medium text-gray-900">{value}</div></div>
          ))}
        </div>
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <span className="font-medium text-gray-700">Total Fare</span>
          <span className="text-2xl font-extrabold text-gray-900">${trip.fare.toFixed(2)}</span>
        </div>
        {trip.passengerRating && (
          <p className="text-sm text-center text-gray-400 mt-2">You rated this ride {'★'.repeat(trip.passengerRating)}{'☆'.repeat(5 - trip.passengerRating)}</p>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const { getMyTrips } = useApp();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const trips = getMyTrips();
  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);
  const spent = trips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">My Trips</h1>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',     value: trips.length },
          { label: 'Completed', value: trips.filter(t => t.status === 'completed').length },
          { label: 'Spent',     value: `$${spent.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['all', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Clock} title="No trips yet" desc={filter === 'all' ? 'Book your first ride from the home tab.' : `No ${filter} trips.`} />
      ) : (
        <div className="space-y-3">
          {filtered.map(trip => (
            <button key={trip.id} onClick={() => setSelected(trip)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">{fmtDate(trip.createdAt)}</p>
                  <div className="mt-1"><StatusBadge status={trip.status} /></div>
                </div>
                <p className="font-bold text-gray-900">${trip.fare.toFixed(2)}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div><span>{trip.pickup}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-gray-700 rounded-full flex-shrink-0"></div><span>{trip.destination}</span></div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">{trip.riderName ? `Rider: ${trip.riderName}` : 'No rider assigned'}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <TripDetail trip={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
