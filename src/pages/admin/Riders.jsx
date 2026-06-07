import { useState } from 'react';
import { Search, Filter, Star, ChevronRight } from 'lucide-react';
import { mockRiders } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';

function RiderDetail({ rider, onClose, onApprove, onSuspend }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">Rider Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-500">{rider.name[0]}</div>
            <div>
              <p className="text-xl font-bold text-gray-900">{rider.name}</p>
              <p className="text-sm text-gray-400">{rider.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={rider.status} />
                {rider.rating > 0 && (
                  <div className="flex items-center gap-0.5 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{rider.rating}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 mb-5">
            {[
              { label: 'Motorcycle', value: rider.motorcycle },
              { label: 'Plate', value: rider.plate },
              { label: 'Total Trips', value: rider.totalTrips },
              { label: 'Joined', value: rider.joined },
              { label: 'Earnings', value: `$${rider.earnings.toFixed(2)}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {rider.status === 'pending' && (
              <>
                <button onClick={() => onApprove(rider.id)} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600">Approve</button>
                <button className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100">Reject</button>
              </>
            )}
            {rider.status === 'approved' && (
              <button onClick={() => onSuspend(rider.id)} className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100">Suspend Rider</button>
            )}
            {rider.status === 'suspended' && (
              <button onClick={() => onApprove(rider.id)} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600">Reinstate</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Riders() {
  const [riders, setRiders] = useState(mockRiders);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = riders.filter(r =>
    (filter === 'all' || r.status === filter) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search))
  );

  function approve(id) {
    setRiders(rs => rs.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setSelected(null);
  }

  function suspend(id) {
    setRiders(rs => rs.map(r => r.id === id ? { ...r, status: 'suspended' } : r));
    setSelected(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Riders</h1>
          <p className="text-gray-400 text-sm">{riders.length} total riders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search riders…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'approved', 'pending', 'suspended'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rider</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Vehicle</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Trips</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Rating</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(rider => (
                <tr key={rider.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelected(rider)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-500 flex-shrink-0">{rider.name[0]}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{rider.name}</p>
                        <p className="text-xs text-gray-400">{rider.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-sm text-gray-700">{rider.motorcycle}</p>
                    <p className="text-xs text-gray-400">{rider.plate}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={rider.status} /></td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-700">{rider.totalTrips}</span></td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {rider.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-700">{rider.rating}</span>
                      </div>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-4"><ChevronRight className="w-4 h-4 text-gray-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No riders found</p>}
        </div>
      </div>

      {selected && <RiderDetail rider={selected} onClose={() => setSelected(null)} onApprove={approve} onSuspend={suspend} />}
    </div>
  );
}
