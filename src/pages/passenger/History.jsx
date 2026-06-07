import { useState } from 'react';
import { MapPin, Star, ChevronRight, Receipt } from 'lucide-react';
import { rideHistory } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';

function RatingStars({ score }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

function TripCard({ trip, onSelect }) {
  return (
    <button onClick={() => onSelect(trip)} className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400">{trip.date}</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={trip.status} />
            {trip.rating && <RatingStars score={trip.rating} />}
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">${trip.fare.toFixed(2)}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
          <span>{trip.pickup}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-gray-700 rounded-full flex-shrink-0"></div>
          <span>{trip.destination}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">Rider: {trip.rider}</span>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </button>
  );
}

function TripDetail({ trip, onClose }) {
  const [rated, setRated] = useState(trip.rating);
  const [hovered, setHovered] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6 pb-8">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Trip Receipt</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-600">{trip.pickup}</span></div>
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><span className="text-gray-600">{trip.destination}</span></div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-400">Rider</p><p className="font-medium text-gray-900">{trip.rider}</p></div>
          <div><p className="text-gray-400">Date</p><p className="font-medium text-gray-900">{trip.date}</p></div>
          <div><p className="text-gray-400">Status</p><StatusBadge status={trip.status} /></div>
          <div><p className="text-gray-400">Fare</p><p className="font-bold text-gray-900 text-lg">${trip.fare.toFixed(2)}</p></div>
        </div>
        {trip.status === 'completed' && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Rate this ride</p>
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRated(s)}>
                  <Star className={`w-8 h-8 ${s <= (hovered || rated || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? rideHistory : rideHistory.filter(t => t.status === filter);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">My Trips</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['all', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total', value: rideHistory.length },
          { label: 'Completed', value: rideHistory.filter(t => t.status === 'completed').length },
          { label: 'Spent', value: `$${rideHistory.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare, 0).toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No trips found</p>}
        {filtered.map(trip => <TripCard key={trip.id} trip={trip} onSelect={setSelected} />)}
      </div>

      {selected && <TripDetail trip={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
