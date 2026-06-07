import { useState } from 'react';
import { User, Phone, Mail, MapPin, Heart, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Profile() {
  const { user } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Mariama Kamara',
    phone: user?.phone || '+231 77 200 2001',
    email: 'mariama@example.com',
  });
  const [saved, setSaved] = useState({ ...form });
  const [savedPlaces] = useState([
    { label: 'Home', address: 'Sinkor, 12th Street, Monrovia' },
    { label: 'Work', address: 'Capitol Building, Monrovia' },
  ]);
  const [emergencyContacts] = useState([
    { name: 'Fatou Kamara', phone: '+231 77 300 0011', relation: 'Sister' },
  ]);

  function save() {
    setSaved({ ...form });
    setEditing(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl font-bold text-orange-500">
          {saved.name[0]}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{saved.name}</p>
          <p className="text-sm text-gray-400">{saved.phone}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Personal Info</h2>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => { setForm({ ...saved }); setEditing(false); }} className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              <button onClick={save} className="p-1.5 text-green-500 hover:text-green-600"><Save className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="p-1.5 text-orange-500 hover:text-orange-600"><Edit3 className="w-4 h-4" /></button>
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
                <input
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Icon className="w-4 h-4 text-gray-300" />
                  <span className="text-sm text-gray-700">{saved[key]}</span>
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
          <button className="text-xs text-orange-500 font-medium">+ Add</button>
        </div>
        {savedPlaces.map(p => (
          <div key={p.label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{p.label}</p>
              <p className="text-xs text-gray-400">{p.address}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Emergency Contacts</h2>
          <button className="text-xs text-orange-500 font-medium">+ Add</button>
        </div>
        {emergencyContacts.map(c => (
          <div key={c.name} className="flex items-center gap-3 py-2.5">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{c.name}</p>
              <p className="text-xs text-gray-400">{c.relation} · {c.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
