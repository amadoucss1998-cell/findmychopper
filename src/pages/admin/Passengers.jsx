import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';
import EmptyState from '../../components/EmptyState';
import * as db from '../../lib/db';

export default function Passengers() {
  const { getAllPassengers } = useApp();
  const [search, setSearch] = useState('');

  const passengers = getAllPassengers();
  const filtered   = passengers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Passengers</h1>
        <p className="text-gray-400 text-sm">{passengers.length} registered users</p>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Users} title="No passengers yet" desc="Passengers will appear here once they register." />
        : <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Passenger','Phone','Trips','Joined'].map((h, i) => (
                      <th key={h} className={`text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${i > 1 ? 'hidden sm:table-cell' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => {
                    const tripCount = db.getTripsForPassenger(p.id).length;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-500 flex-shrink-0">{p.name[0]}</div>
                            <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{p.phone}</td>
                        <td className="px-5 py-4 hidden sm:table-cell text-sm text-gray-700">{tripCount}</td>
                        <td className="px-5 py-4 hidden sm:table-cell text-sm text-gray-400">{fmtDate(p.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      }
    </div>
  );
}
