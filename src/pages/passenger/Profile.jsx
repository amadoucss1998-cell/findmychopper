import { useState } from 'react';
import { User, Phone, Mail, MapPin, Heart, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Profile() {
  const { user, updateUser, trips } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm]= useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [savedPlaces, setSavedPlaces] = useState([
    { label: 'Home', address: 'Sinkor, 12th Street, Monrovia' },
    { label: 'Work', address: 'Capitol Building, Monrovia' },
  ]);
  const [emergencyContacts] = useState([
    { name: 'Fatou Kamara', phone: '+231 77 300 0011', relation: 'Sister' },
  ]);

  function save() {
    updateUser(form);
    setEditing(false);
  }

  function cancel() {
    setForm({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
    setEditing(false);
  }

  const myTrips = trips.filter(t => t.passengerId === 'p1' || t.passengerId === '1');
  const totalSpent = myTrips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl font-bold text-orange-500">
          {(user?.name || 'U')[0]}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.phone}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="font-bold text-gray-900">{myTrips.length}</p><p className="text-xs text-gray-400">Trips</p></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="font-bold text-gray-900">{myTrips.filter(t => t.status === 'completed').length}</p><p className="text-xs text-gray-400">Completed</p></div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center"><p className="font-bold text-gray-900">${totalSpent.toFixed(2)}</p><p className="text-xs text-gray-400">Spent</p></div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Personal Info</h2>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={cancel}><X className="w-4 h-4 text-gray-400" /></button>
              <button onClick={save}><Save className="w-4 h-4 text-green-500" /></button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}><Edit3 className="w-4 h-4 text-orange-500" /></button>
          )}
        </div>
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', icon: User },
            { key: 'phone', label: 'Phone', icon: Phone },
            { key: 'email', label: 'Email', icon: Mail },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
              {editing ? (
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Icon className="w-4 h-4 text-gray-300" />
                  <span className="text-sm text-gray-700">{user?.[key] || '—'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Saved Places */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Saved Places</h2>
          <button onClick={() => setSavedPlaces(ps => [...ps, { label: 'New Place', address: 'Monrovia, Liberia' }])}
            className="text-xs text-orange-500 font-medium">+ Add</button>
        </div>
        {savedPlaces.map((p, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center"><MapPin className="w-4 h-4 text-orange-400" /></div>
            <div><p className="text-sm font-medium text-gray-800">{p.label}</p><p className="text-xs text-gray-400">{p.address}</p></div>
          </div>
        ))}
      </div>

      {/* Emergency */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Emergency Contacts</h2>
          <button className="text-xs text-orange-500 font-medium">+ Add</button>
        </div>
        {emergencyContacts.map(c => (
          <div key={c.name} className="flex items-center gap-3 py-2.5">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><Heart className="w-4 h-4 text-red-400" /></div>
            <div><p className="text-sm font-medium text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.relation} · {c.phone}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
