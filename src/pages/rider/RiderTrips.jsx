import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';

export default function RiderTrips() {
  const { trips, riders, user } = useApp();
  const rider = riders.find(r => r.id === (user?.riderId || '1')) || riders[0];
  const myTrips = trips.filter(t => t.riderId === rider?.id || t.riderName === rider?.name);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">Trip History</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="font-bold text-gray-900">{myTrips.length}</p><p className="text-xs text-gray-400">Total</p></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="font-bold text-gray-900">{myTrips.filter(t => t.status === 'completed').length}</p><p className="text-xs text-gray-400">Completed</p></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="font-bold text-gray-900">${myTrips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare * 0.8, 0).toFixed(2)}</p><p className="text-xs text-gray-400">Earned</p></div>
      </div>

      <div className="space-y-3">
        {myTrips.length === 0 && <p className="text-center text-gray-400 py-10">No trips yet</p>}
        {myTrips.map(trip => (
          <div key={trip.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">{trip.date}</p>
              <div className="flex items-center gap-2">
                <StatusBadge status={trip.status} />
                <span className="font-bold text-gray-900">${trip.fare.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-1.5 mb-2">
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-gray-600">{trip.pickup}</span></div>
              <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 bg-gray-700 rounded-full"></div><span className="text-gray-600">{trip.destination}</span></div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-400">Passenger: <span className="font-medium text-gray-700">{trip.passengerName}</span></p>
              <p className="text-xs font-semibold text-green-600">+${(trip.fare * 0.8).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
