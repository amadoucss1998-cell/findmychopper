import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';

function buildWeekData(trips) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now  = new Date();
  return days.map((day, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (now.getDay() - i + 7) % 7);
    const dayTrips = trips.filter(t => {
      const d = new Date(t.completedAt || t.createdAt);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth();
    });
    const earnings = dayTrips.reduce((s, t) => s + t.fare * 0.8, 0);
    return { day, earnings: parseFloat(earnings.toFixed(2)), trips: dayTrips.length };
  });
}

export default function RiderEarnings() {
  const { user, getMyTrips } = useApp();
  const trips    = getMyTrips().filter(t => t.status === 'completed');
  const weekData = buildWeekData(trips);

  const todayIdx   = new Date().getDay();
  const todayEarn  = weekData[todayIdx]?.earnings || 0;
  const weekEarn   = weekData.reduce((s, d) => s + d.earnings, 0);
  const totalEarn  = user?.earnings || 0;
  const totalTrips = user?.totalTrips || 0;
  const avgPerTrip = totalTrips > 0 ? (totalEarn / totalTrips).toFixed(2) : '0.00';

  // Last trip breakdown
  const lastTrip = trips[0];
  const gross    = lastTrip?.fare || 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">Earnings</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'All Time',    value: `$${totalEarn.toFixed(2)}`, sub: `${totalTrips} trips total` },
          { label: 'This Week',   value: `$${weekEarn.toFixed(2)}`,  sub: `${weekData.reduce((s,d)=>s+d.trips,0)} trips` },
          { label: 'Today',       value: `$${todayEarn.toFixed(2)}`, sub: `${weekData[todayIdx]?.trips || 0} trips` },
          { label: 'Avg / Trip',  value: `$${avgPerTrip}`,           sub: 'your share' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">This Week</h2>
          <div className="flex items-center gap-1 text-xs text-green-500 font-medium"><TrendingUp className="w-3.5 h-3.5" />Live data</div>
        </div>
        {trips.length === 0
          ? <p className="text-center text-gray-400 text-sm py-8">Complete trips to see earnings</p>
          : <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weekData} barSize={28}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis hide />
                <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Earnings']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="earnings" fill="#f97316" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
        }
      </div>

      {/* Commission breakdown */}
      {lastTrip && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-gray-900 mb-1">Last Trip Breakdown</h2>
          <p className="text-xs text-gray-400 mb-4">{fmtDate(lastTrip.completedAt || lastTrip.createdAt)}</p>
          {[
            { label: 'Total Fare',          value: `$${gross.toFixed(2)}`,          color: 'text-gray-900' },
            { label: 'Platform Fee (20%)',  value: `-$${(gross * 0.2).toFixed(2)}`, color: 'text-red-500'  },
            { label: 'Your Earnings (80%)', value: `$${(gross * 0.8).toFixed(2)}`,  color: 'text-green-600', bold: true },
          ].map(({ label, value, color, bold }) => (
            <div key={label} className={`flex justify-between py-2.5 border-b border-gray-50 last:border-0 ${bold ? 'font-bold' : ''}`}>
              <span className={`text-sm ${bold ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
              <span className={`text-sm font-semibold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Trip list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Trips</h2>
        {trips.length === 0
          ? <p className="text-sm text-gray-400 text-center py-4">No completed trips yet</p>
          : trips.slice(0, 8).map(t => (
            <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{t.pickup} → {t.destination}</p>
                <p className="text-xs text-gray-400">{fmtDate(t.completedAt || t.createdAt)}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-bold text-gray-900">${t.fare.toFixed(2)}</p>
                <p className="text-xs text-green-600">+${(t.fare * 0.8).toFixed(2)}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
