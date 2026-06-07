import { useState } from 'react';
import { Search, Car } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function Trips() {
  const { getAllTrips } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const trips    = getAllTrips();
  const filtered = trips.filter(t =>
    (filter === 'all' || t.status === filter) &&
    ((t.passengerName||'').toLowerCase().includes(search.toLowerCase()) ||
     (t.riderName||'').toLowerCase().includes(search.toLowerCase()) ||
     (t.pickup||'').toLowerCase().includes(search.toLowerCase()) ||
     (t.destination||'').toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total:     trips.length,
    active:    trips.filter(t => ['requested','accepted','arrived','started'].includes(t.status)).length,
    completed: trips.filter(t => t.status === 'completed').length,
    cancelled: trips.filter(t => t.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Trips</h1>
        <p className="text-gray-400 text-sm">{trips.length} total</p>
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
          {['all','active','completed','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Car} title="No trips found" desc={trips.length === 0 ? 'Trips will appear here once passengers book rides.' : 'No trips match your filter.'} />
        : <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Route','Passenger','Rider','Fare','Status','Date'].map((h, i) => (
                      <th key={h} className={`text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${i >= 2 && i <= 3 ? 'hidden md:table-cell' : ''} ${i === 5 ? 'hidden lg:table-cell' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{t.pickup}</p>
                        <p className="text-xs text-gray-400">→ {t.destination}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{t.passengerName}</td>
                      <td className="px-4 py-4 hidden md:table-cell text-sm text-gray-600">{t.riderName || '—'}</td>
                      <td className="px-4 py-4 hidden md:table-cell text-sm font-bold text-gray-900">${t.fare.toFixed(2)}</td>
                      <td className="px-4 py-4"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-4 hidden lg:table-cell text-xs text-gray-400">{fmtDate(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      }
    </div>
  );
}
