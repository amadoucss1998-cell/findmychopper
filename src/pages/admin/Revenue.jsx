import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { revenueData, monthlyData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function Revenue() {
  const { riders, trips } = useApp();
  const weeklyTotal      = revenueData.reduce((s, d) => s + d.revenue, 0);
  const weeklyCommission = weeklyTotal * 0.2;
  const monthlyCommission= monthlyData.reduce((s, d) => s + d.revenue * 0.2, 0);
  const totalAllTime     = trips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare * 0.2, 0);

  const topRiders = [...riders]
    .filter(r => r.status === 'approved')
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Revenue</h1>
        <p className="text-gray-400 text-sm">Platform commission analytics (20% per trip)</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'This Week', value: `$${weeklyCommission.toFixed(2)}`, sub: `from $${weeklyTotal.toFixed(2)} in fares`, icon: DollarSign, color: 'text-green-500 bg-green-50' },
          { label: 'This Month', value: `$${monthlyCommission.toFixed(2)}`, sub: 'platform commission', icon: TrendingUp, color: 'text-blue-500 bg-blue-50' },
          { label: 'All Time', value: `$${(totalAllTime + monthlyCommission).toFixed(2)}`, sub: 'total revenue', icon: Percent, color: 'text-orange-500 bg-orange-50' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">{label}</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${color}`}><Icon className="w-5 h-5" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Total Fares']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Top Earning Riders</h2>
        {topRiders.length === 0 && <p className="text-sm text-gray-400">No approved riders yet</p>}
        <div className="space-y-3">
          {topRiders.map((rider, i) => (
            <div key={rider.id} className="flex items-center gap-4">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-400'}`}>{i + 1}</span>
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-500 flex-shrink-0">{rider.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{rider.name}</p>
                <p className="text-xs text-gray-400">{rider.totalTrips} trips</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">${rider.earnings.toFixed(2)}</p>
                <p className="text-xs text-gray-400">earned</p>
              </div>
              <div className="w-24 hidden sm:block">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: `${topRiders[0] ? (rider.earnings / topRiders[0].earnings) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
