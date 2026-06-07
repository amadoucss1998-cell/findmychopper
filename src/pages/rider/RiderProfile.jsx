import { useState } from 'react';
import { Star, Bike, Shield, CheckCircle, Edit3, Save, X } from 'lucide-react';
import { mockRiders } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';

export default function RiderProfile() {
  const rider = mockRiders[0];
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: rider.name, phone: rider.phone, motorcycle: rider.motorcycle, plate: rider.plate });
  const [saved, setSaved] = useState({ ...form });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar & stats */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 mb-5 text-white">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {saved.name[0]}
          </div>
          <div>
            <p className="text-xl font-bold">{saved.name}</p>
            <p className="text-orange-200 text-sm">{saved.phone}</p>
            <StatusBadge status={rider.status} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl font-extrabold">{rider.rating}</p><p className="text-xs text-orange-200 flex items-center justify-center gap-0.5"><Star className="w-3 h-3 fill-white" /> Rating</p></div>
          <div><p className="text-2xl font-extrabold">{rider.totalTrips}</p><p className="text-xs text-orange-200">Trips</p></div>
          <div><p className="text-2xl font-extrabold">${rider.earnings.toFixed(0)}</p><p className="text-xs text-orange-200">Earned</p></div>
        </div>
      </div>

      {/* Vehicle info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Vehicle Info</h2>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => { setForm({ ...saved }); setEditing(false); }}><X className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => { setSaved({ ...form }); setEditing(false); }}><Save className="w-4 h-4 text-green-500" /></button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}><Edit3 className="w-4 h-4 text-orange-500" /></button>
          )}
        </div>
        <div className="space-y-3">
          {[
            { key: 'motorcycle', label: 'Motorcycle Model' },
            { key: 'plate', label: 'Plate Number' },
          ].map(({ key, label }) => (
            <div key={key}>
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              {editing ? (
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              ) : (
                <p className="text-sm font-medium text-gray-900">{saved[key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verification */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Verification</h2>
        {[
          { label: 'National ID', verified: true },
          { label: "Driver's License", verified: true },
          { label: 'Motorcycle Photo', verified: true },
          { label: 'Profile Photo', verified: true },
        ].map(({ label, verified }) => (
          <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${verified ? 'bg-green-50' : 'bg-gray-50'}`}>
              {verified ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Shield className="w-4 h-4 text-gray-300" />}
            </div>
            <span className="text-sm font-medium text-gray-800 flex-1">{label}</span>
            <span className={`text-xs font-medium ${verified ? 'text-green-500' : 'text-gray-400'}`}>{verified ? 'Verified' : 'Pending'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
