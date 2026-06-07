import { useState } from 'react';
import { User, Phone, Mail, MapPin, Heart, Edit3, Save, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';

export default function Profile() {
  const { user, updateProfile, logout, getMyTrips } = useApp();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '' });
  const [savedPlaces, setSavedPlaces] = useState(user?.savedPlaces || []);
  const [emergencyContacts]           = useState(user?.emergencyContacts || []);

  const trips   = getMyTrips();
  const spent   = trips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare, 0);

  function save() {
    updateProfile({ ...form, savedPlaces });
    setEditing(false);
  }

  function handleLogout() { logout(); navigate('/'); }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      {/* Avatar + stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-18 h-18 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-500 flex-shrink-0">
          {user?.name?.[0] || 'U'}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.phone}</p>
          <p className="text-xs text-gray-300 mt-0.5">Member since {fmtDate(user?.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Trips',     value: trips.length },
          { label: 'Completed', value: trips.filter(t => t.status === 'completed').length },
          { label: 'Spent',     value: `$${spent.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <p className="font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Personal Info</h2>
          {editing
            ? <div className="flex gap-2">
                <button onClick={() => setEditing(false)}><X className="w-4 h-4 text-gray-400" /></button>
                <button onClick={save}><Save className="w-4 h-4 text-green-500" /></button>
              </div>
            : <button onClick={() => setEditing(true)}><Edit3 className="w-4 h-4 text-orange-500" /></button>
          }
        </div>
        <div className="space-y-4">
          {[
            { key: 'name',  label: 'Full Name', icon: User  },
            { key: 'email', label: 'Email',     icon: Mail  },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
              {editing
                ? <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                : <div className="flex items-center gap-2 mt-1"><Icon className="w-4 h-4 text-gray-300" /><span className="text-sm text-gray-700">{user?.[key] || '—'}</span></div>
              }
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</label>
            <div className="flex items-center gap-2 mt-1"><Phone className="w-4 h-4 text-gray-300" /><span className="text-sm text-gray-700">{user?.phone}</span></div>
          </div>
        </div>
      </div>

      {/* Saved places */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Saved Places</h2>
          <button onClick={() => {
            const label = prompt('Label (e.g. Home, Work)');
            const address = prompt('Address');
            if (label && address) {
              const updated = [...savedPlaces, { label, address }];
              setSavedPlaces(updated);
              updateProfile({ savedPlaces: updated });
            }
          }} className="text-xs text-orange-500 font-medium">+ Add</button>
        </div>
        {savedPlaces.length === 0
          ? <p className="text-sm text-gray-400 text-center py-3">No saved places yet</p>
          : savedPlaces.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center"><MapPin className="w-4 h-4 text-orange-400" /></div>
              <div><p className="text-sm font-medium text-gray-800">{p.label}</p><p className="text-xs text-gray-400">{p.address}</p></div>
            </div>
          ))
        }
      </div>

      {/* Emergency contacts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Emergency Contacts</h2>
          <button className="text-xs text-orange-500 font-medium">+ Add</button>
        </div>
        {emergencyContacts.length === 0
          ? <p className="text-sm text-gray-400 text-center py-3">No emergency contacts added</p>
          : emergencyContacts.map((c, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><Heart className="w-4 h-4 text-red-400" /></div>
              <div><p className="text-sm font-medium text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.relation} · {c.phone}</p></div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
