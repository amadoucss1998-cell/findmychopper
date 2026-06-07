import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Bike, Users, Car, DollarSign, TrendingUp } from 'lucide-react';
import { revenueData, monthlyData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const { riders, trips, approveRider, rejectRider } = useApp();
  const activeTrips  = trips.filter(t => t.status === 'active' || t.status === 'started' || t.status === 'accepted' || t.status === 'arrived');
  const pendingRiders= riders.filter(r => r.status === 'pending');
  const totalRevenue = trips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare * 0.2, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Riders" value={riders.length} sub={`${pendingRiders.length} pending`} icon={Bike} color="orange" />
        <StatCard title="Active Trips" value={activeTrips.length} sub="right now" icon={Car} color="blue" />
        <StatCard title="Total Trips" value={trips.length} sub="all time" icon={TrendingUp} color="green" />
        <StatCard title="Revenue (20%)" value={`$${totalRevenue.toFixed(2)}`} sub="platform commission" icon={DollarSign} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Trips</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis hide />
              <Tooltip formatter={(v) => [v, 'Trips']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="trips" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Approvals</h2>
            {pendingRiders.length > 0 && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">{pendingRiders.length} new</span>}
          </div>
          {pendingRiders.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">All caught up ✓</p>}
          {pendingRiders.map(rider => (
            <div key={rider.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-500">{rider.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{rider.name}</p>
                <p className="text-xs text-gray-400">{rider.motorcycle}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => approveRider(rider.id)} className="text-xs px-2.5 py-1 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600">Approve</button>
                <button onClick={() => rejectRider(rider.id)} className="text-xs px-2.5 py-1 bg-red-50 text-red-500 rounded-lg font-medium hover:bg-red-100">Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Trips</h2>
          {trips.slice(0, 5).map(trip => (
            <div key={trip.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{trip.pickup} → {trip.destination}</p>
                <p className="text-xs text-gray-400">{trip.passengerName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">${trip.fare.toFixed(2)}</p>
                <StatusBadge status={trip.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
