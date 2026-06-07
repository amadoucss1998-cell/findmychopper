import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, Percent, Bike } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';

function buildMonthData(trips) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now    = new Date();
  return months.slice(0, now.getMonth() + 1).map((m, i) => {
    const mTrips = trips.filter(t => new Date(t.createdAt).getMonth() === i && t.status === 'completed');
    return {
      month:   m,
      trips:   mTrips.length,
      revenue: parseFloat(mTrips.reduce((s,t) => s + t.fare * 0.2, 0).toFixed(2)),
      fares:   parseFloat(mTrips.reduce((s,t) => s + t.fare, 0).toFixed(2)),
    };
  });
}

export default function Revenue() {
  const { getAllTrips, getAllRiders } = useApp();
  const trips    = getAllTrips();
  const riders   = getAllRiders();

  const completed    = trips.filter(t => t.status === 'completed');
  const totalFares   = completed.reduce((s,t) => s + t.fare, 0);
  const totalRevenue = totalFares * 0.2;
  const monthData    = buildMonthData(trips);

  const topRiders = [...riders]
    .filter(r => r.riderStatus === 'approved' && r.earnings > 0)
    .sort((a,b) => b.earnings - a.earnings)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Revenue</h1>
        <p className="text-gray-400 text-sm">Platform earns 20% commission on each trip</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Fares',     value: `$${totalFares.toFixed(2)}`,   sub: `${completed.length} completed trips`, icon: DollarSign, color: 'text-blue-500 bg-blue-50'   },
          { label: 'Platform Revenue',value: `$${totalRevenue.toFixed(2)}`, sub: '20% of all fares',                   icon: TrendingUp, color: 'text-green-500 bg-green-50' },
          { label: 'Commission Rate', value: '20%',                         sub: 'riders keep 80%',                    icon: Percent,    color: 'text-orange-500 bg-orange-50'},
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

      {trips.length === 0
        ? <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No revenue data yet</p>
            <p className="text-sm mt-1">Revenue charts will appear once trips are completed</p>
          </div>
        : <>
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Monthly Trips</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis hide />
                    <Tooltip formatter={v => [v, 'Trips']} contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,.1)' }} />
                    <Bar dataKey="trips" fill="#f97316" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `$${v}`} />
                    <Tooltip formatter={v => [`$${v.toFixed(2)}`, 'Revenue']} contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,.1)' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} dot={{ fill:'#f97316', r:4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {topRiders.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Top Earning Riders</h2>
                <div className="space-y-3">
                  {topRiders.map((r, i) => (
                    <div key={r.id} className="flex items-center gap-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>{i+1}</span>
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-500 flex-shrink-0">{r.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.totalTrips} trips</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">${r.earnings.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">earned</p>
                      </div>
                      <div className="w-24 hidden sm:block">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(r.earnings / topRiders[0].earnings) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
      }
    </div>
  );
}
