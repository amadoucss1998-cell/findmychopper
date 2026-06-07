import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueData, monthlyData } from '../../data/mockData';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function RiderEarnings() {
  const weekly = revenueData.reduce((s, d) => s + d.revenue * 0.8, 0).toFixed(2);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">My Earnings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Today', value: '$18.50', sub: '8 trips' },
          { label: 'This Week', value: `$${weekly}`, sub: '39 trips' },
          { label: 'This Month', value: '$312.00', sub: '142 trips' },
          { label: 'Total Earned', value: '$1,240.50', sub: 'all time' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">This Week</h2>
          <div className="flex items-center gap-1 text-xs text-green-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +12%
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={revenueData} barSize={28}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis hide />
            <Tooltip formatter={(v) => [`$${(v * 0.8).toFixed(2)}`, 'Earnings']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Commission breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="font-semibold text-gray-900 mb-4">Commission Breakdown</h2>
        {[
          { label: 'Total Fares', value: '$23.12', color: 'text-gray-900' },
          { label: 'Platform Fee (20%)', value: '-$4.62', color: 'text-red-500' },
          { label: 'Your Earnings (80%)', value: '$18.50', color: 'text-green-600', bold: true },
        ].map(({ label, value, color, bold }) => (
          <div key={label} className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${bold ? 'font-bold' : ''}`}>
            <span className={`text-sm ${bold ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
            <span className={`text-sm font-semibold ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Monthly Trend</h2>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={monthlyData} barSize={24}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis hide />
            <Tooltip formatter={(v) => [`$${(v * 0.8).toFixed(0)}`, 'Earnings']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="revenue" fill="#fb923c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
