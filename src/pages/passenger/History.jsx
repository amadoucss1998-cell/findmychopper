import { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';

function RatingStars({ score, onRate }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} onMouseEnter={() => onRate && setHovered(s)} onMouseLeave={() => onRate && setHovered(0)} onClick={() => onRate?.(s)}>
          <Star className={`w-5 h-5 ${s <= (hovered || score || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
        </button>
      ))}
    </div>
  );
}

function TripDetail({ trip, onClose }) {
  const [rating, setRating] = useState(trip.rating || 0);
  const [submitted, setSubmitted] = useState(!!trip.rating);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full p-6 pb-8 max-h-[80vh] overflow-y-auto">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Trip Receipt</h3>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Close</button>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-600">{trip.pickup}</span></div>
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-800 rounded-full"></div><span className="text-gray-600">{trip.destination}</span></div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-400 text-xs">Rider</p><p className="font-medium text-gray-900">{trip.riderName || trip.rider || '—'}</p></div>
          <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium text-gray-900">{trip.date}</p></div>
          <div><p className="text-gray-400 text-xs">Distance</p><p className="font-medium text-gray-900">{trip.distance} km</p></div>
          <div><p className="text-gray-400 text-xs">Status</p><StatusBadge status={trip.status} /></div>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-4">
          <span className="font-medium text-gray-700">Total Fare</span>
          <span className="text-2xl font-extrabold text-gray-900">${trip.fare.toFixed(2)}</span>
        </div>
        {trip.status === 'completed' && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">{submitted ? 'Your rating' : 'Rate this ride'}</p>
            <RatingStars score={rating} onRate={submitted ? null : (s) => { setRating(s); setSubmitted(true); }} />
            {submitted && <p className="text-xs text-green-500 mt-2 font-medium">Rating submitted ✓</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const { trips, user } = useApp();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const myTrips = trips.filter(t => t.passengerId === (user?.id || 'p1') || t.passengerId === 'p1' || t.passengerId === '1');
  const filtered = filter === 'all' ? myTrips : myTrips.filter(t => t.status === filter);

  const totalSpent = myTrips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">My Trips</h1>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['all', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="text-xl font-bold text-gray-900">{myTrips.length}</p><p className="text-xs text-gray-400">Total</p></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="text-xl font-bold text-gray-900">{myTrips.filter(t => t.status === 'completed').length}</p><p className="text-xs text-gray-400">Completed</p></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="text-xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p><p className="text-xs text-gray-400">Spent</p></div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No trips yet</p>}
        {filtered.map(trip => (
          <button key={trip.id} onClick={() => setSelected(trip)}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400">{trip.date}</p>
                <div className="mt-1"><StatusBadge status={trip.status} /></div>
              </div>
              <p className="font-bold text-gray-900">${trip.fare.toFixed(2)}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div><span>{trip.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 bg-gray-700 rounded-full flex-shrink-0"></div><span>{trip.destination}</span></div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-400">Rider: {trip.riderName || trip.rider || '—'}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </button>
        ))}
      </div>

      {selected && <TripDetail trip={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
