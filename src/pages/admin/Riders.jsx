import { useState } from 'react';
import { Search, Star, ChevronRight, CheckCircle, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

function RiderModal({ rider, onClose, onAction }) {
  const docs = [
    { label: 'National ID',      img: rider.nationalId    },
    { label: "Driver's License", img: rider.licenseImg    },
    { label: 'Motorcycle Photo', img: rider.motorcycleImg },
    { label: 'Profile Photo',    img: rider.profileImg    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Rider Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-xl font-bold text-orange-500 flex-shrink-0 overflow-hidden">
              {rider.profileImg ? <img src={rider.profileImg} className="w-full h-full object-cover" alt="" /> : rider.name[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900">{rider.name}</p>
              <p className="text-sm text-gray-400">{rider.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={rider.riderStatus || 'pending'} />
                {rider.rating > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-gray-500"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{rider.rating}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 mb-4 text-sm">
            {[
              { label: 'Motorcycle',    value: rider.motorcycle || '—' },
              { label: 'Plate',         value: rider.plate || '—' },
              { label: 'License No.',   value: rider.licenseNumber || '—' },
              { label: 'Total Trips',   value: rider.totalTrips || 0 },
              { label: 'Total Earned',  value: `$${(rider.earnings || 0).toFixed(2)}` },
              { label: 'Joined',        value: fmtDate(rider.createdAt) },
            ].map(({ label, value }) => (
              <div key={label}><p className="text-xs text-gray-400">{label}</p><p className="font-medium text-gray-900">{value}</p></div>
            ))}
          </div>

          {/* Documents */}
          <h4 className="font-semibold text-gray-900 text-sm mb-3">Submitted Documents</h4>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {docs.map(({ label, img }) => (
              <div key={label} className={`rounded-xl overflow-hidden border-2 ${img ? 'border-green-200' : 'border-gray-100'}`}>
                {img
                  ? <img src={img} alt={label} className="w-full h-24 object-cover" />
                  : <div className="w-full h-24 bg-gray-50 flex items-center justify-center"><Shield className="w-6 h-6 text-gray-200" /></div>
                }
                <div className={`px-2 py-1 flex items-center gap-1 ${img ? 'bg-green-50' : 'bg-gray-50'}`}>
                  {img ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Shield className="w-3 h-3 text-gray-300" />}
                  <span className="text-xs font-medium truncate">{label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {rider.riderStatus === 'pending' && (
              <>
                <button onClick={() => onAction('approve', rider.id)} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600">Approve</button>
                <button onClick={() => onAction('reject', rider.id)} className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100">Reject</button>
              </>
            )}
            {rider.riderStatus === 'approved' && (
              <button onClick={() => onAction('suspend', rider.id)} className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100">Suspend Rider</button>
            )}
            {['suspended','rejected'].includes(rider.riderStatus) && (
              <button onClick={() => onAction('approve', rider.id)} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600">Reinstate</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Riders() {
  const { getAllRiders, approveRider, suspendRider, rejectRider, reinstateRider } = useApp();
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [,         refresh]     = useState(0);
  const rerender = () => refresh(n => n+1);

  const riders   = getAllRiders();
  const filtered = riders.filter(r =>
    (filter === 'all' || r.riderStatus === filter) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search))
  );

  const counts = {
    all:       riders.length,
    pending:   riders.filter(r => r.riderStatus === 'pending').length,
    approved:  riders.filter(r => r.riderStatus === 'approved').length,
    suspended: riders.filter(r => r.riderStatus === 'suspended').length,
  };

  function handleAction(action, id) {
    if (action === 'approve')  approveRider(id);
    if (action === 'suspend')  suspendRider(id);
    if (action === 'reject')   rejectRider(id);
    if (action === 'reinstate')reinstateRider(id);
    setSelected(null);
    rerender();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Riders</h1>
        <p className="text-gray-400 text-sm">{riders.length} registered · {counts.pending} pending approval</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(counts).map(([f, n]) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${filter === f ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{n}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Bike} title="No riders found" desc={search ? 'Try a different search.' : 'No riders have registered yet.'} />
        : <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Rider','Vehicle','Status','Trips','Rating',''].map(h => (
                      <th key={h} className={`text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${h === '' || h === 'Trips' || h === 'Rating' ? 'hidden md:table-cell' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelected(r)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-500 flex-shrink-0 overflow-hidden">
                            {r.profileImg ? <img src={r.profileImg} className="w-full h-full object-cover" alt="" /> : r.name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">{r.motorcycle || '—'}</p>
                        <p className="text-xs text-gray-400">{r.plate || '—'}</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={r.riderStatus || 'pending'} /></td>
                      <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-700">{r.totalTrips || 0}</td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {r.rating > 0
                          ? <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /><span className="text-sm text-gray-700">{r.rating}</span></div>
                          : <span className="text-xs text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-4"><ChevronRight className="w-4 h-4 text-gray-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      }

      {selected && <RiderModal rider={selected} onClose={() => setSelected(null)} onAction={handleAction} />}
    </div>
  );
}
