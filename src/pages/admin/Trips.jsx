import { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';

export default function Trips() {
  const { trips } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = trips.filter(t =>
    (filter === 'all' || t.status === filter) &&
    ((t.passengerName || '').toLowerCase().includes(search.toLowerCase()) ||
     (t.riderName || '').toLowerCase().includes(search.toLowerCase()) ||
     (t.pickup || '').toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total:     trips.length,
    completed: trips.filter(t => t.status === 'completed').length,
    active:    trips.filter(t => ['active','accepted','arrived','started','requested'].includes(t.status)).length,
    cancelled: trips.filter(t => t.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Trips</h1>
        <p className="text-gray-400 text-sm">{trips.length} total trips</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-gray-900">{val}</p>
            <p className="text-xs text-gray-400 capitalize">{key}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trips…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Route</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Passenger</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Rider</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fare</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(trip => (
                <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{trip.pickup}</p>
                    <p className="text-xs text-gray-400">→ {trip.destination}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-sm text-gray-600">{trip.passengerName}</td>
                  <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{trip.riderName || '—'}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-900">${trip.fare.toFixed(2)}</td>
                  <td className="px-5 py-4"><StatusBadge status={trip.status} /></td>
                  <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">{trip.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No trips found</p>}
        </div>
      </div>
    </div>
  );
}
