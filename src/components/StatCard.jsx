const colors = {
  orange: 'bg-orange-50 text-orange-500',
  blue:   'bg-blue-50 text-blue-500',
  green:  'bg-green-50 text-green-500',
  purple: 'bg-purple-50 text-purple-500',
  red:    'bg-red-50 text-red-500',
};

export default function StatCard({ title, value, sub, icon: Icon, color = 'orange' }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        {Icon && <div className={`p-2.5 rounded-xl ${colors[color]}`}><Icon className="w-5 h-5" /></div>}
      </div>
    </div>
  );
}
