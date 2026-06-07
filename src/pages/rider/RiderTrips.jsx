import { mockTrips } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';

export default function RiderTrips() {
  const trips = mockTrips.filter(t => t.riderId === '1');

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-5">Trip History</h1>
      <div className="space-y-3">
        {trips.map(trip => (
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
            <p className="text-xs text-gray-400">Passenger: <span className="font-medium text-gray-700">{trip.passengerName}</span> · {trip.distance} km</p>
          </div>
        ))}
      </div>
    </div>
  );
}
