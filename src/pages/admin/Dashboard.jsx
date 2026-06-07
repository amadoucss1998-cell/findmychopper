import { useState, useEffect } from 'react';
import { Bike, Users, Car, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

function buildChartData(trips) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now  = new Date();
  return days.map((day, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (now.getDay() - i + 7) % 7);
    const dayTrips = trips.filter(t => {
      const d = new Date(t.createdAt);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth();
    });
    return { day, trips: dayTrips.length, revenue: parseFloat(dayTrips.reduce((s,t) => s + t.fare * 0.2, 0).toFixed(2)) };
  });
}

export default function Dashboard() {
  const { getAllRiders, getAllPassengers, getAllTrips, approveRider, rejectRider } = useApp();
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const riders     = getAllRiders();
  const passengers = getAllPassengers();
  const trips      = getAllTrips();

  const pending   = riders.filter(r => r.riderStatus === 'pending');
  const active    = trips.filter(t => ['requested','accepted','arrived','started'].includes(t.status));
  const revenue   = trips.filter(t => t.status === 'completed').reduce((s,t) => s + t.fare * 0.2, 0);
  const chartData = buildChartData(trips);

  function handleApprove(id) { approveRider(id); refresh(); }
  function handleReject(id)  { rejectRider(id);  refresh(); }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric' })}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Riders"    value={riders.length}      sub={`${pending.length} pending`} icon={Bike}        color="orange" />
        <StatCard title="Passengers"      value={passengers.length}  sub="registered"                  icon={Users}       color="blue"   />
        <StatCard title="Active Trips"    value={active.length}      sub="right now"                   icon={Car}         color="green"  />
        <StatCard title="Platform Revenue"value={`$${revenue.toFixed(2)}`} sub="20% commission"       icon={DollarSign}  color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Daily Trips (This Week)</h2>
          {trips.length === 0
            ? <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No trip data yet</div>
            : <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barSize={28}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis hide />
                  <Tooltip formatter={(v,n) => [n === 'revenue' ? `$${v.toFixed(2)}` : v, n === 'revenue' ? 'Revenue' : 'Trips']} contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,.1)' }} />
                  <Bar dataKey="trips" fill="#f97316" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Daily Revenue (This Week)</h2>
          {trips.length === 0
            ? <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No revenue data yet</div>
            : <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis hide />
                  <Tooltip formatter={v => [`$${v.toFixed(2)}`, 'Revenue']} contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} dot={{ fill:'#f97316', r:4 }} />
                </LineChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending approvals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Approvals</h2>
            {pending.length > 0 && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">{pending.length}</span>}
          </div>
          {pending.length === 0
            ? <p className="text-sm text-gray-400 text-center py-6">All riders reviewed ✓</p>
            : pending.slice(0,5).map(r => (
              <div key={r.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-500 flex-shrink-0">{r.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.motorcycle || 'No vehicle listed'}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => handleApprove(r.id)} className="text-xs px-2.5 py-1 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600">Approve</button>
                  <button onClick={() => handleReject(r.id)} className="text-xs px-2.5 py-1 bg-red-50 text-red-500 rounded-lg font-medium hover:bg-red-100">Reject</button>
                </div>
              </div>
            ))
          }
        </div>

        {/* Recent trips */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Trips</h2>
          {trips.length === 0
            ? <p className="text-sm text-gray-400 text-center py-6">No trips yet</p>
            : trips.slice(0,6).map(t => (
              <div key={t.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.pickup} → {t.destination}</p>
                  <p className="text-xs text-gray-400">{t.passengerName} · {fmtDate(t.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">${t.fare.toFixed(2)}</p>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
