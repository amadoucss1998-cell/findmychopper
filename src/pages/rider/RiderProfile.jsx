import { useState } from 'react';
import { Star, CheckCircle, Shield, Edit3, Save, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fmtDate } from '../../lib/utils';
import StatusBadge from '../../components/StatusBadge';

export default function RiderProfile() {
  const { user, updateProfile, logout } = useApp();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', motorcycle: user?.motorcycle || '', plate: user?.plate || '' });

  function save() { updateProfile(form); setEditing(false); }
  function handleLogout() { logout(); navigate('/'); }

  const docs = [
    { label: 'National ID',        key: 'nationalId',    img: user?.nationalId    },
    { label: "Driver's License",   key: 'licenseImg',    img: user?.licenseImg    },
    { label: 'Motorcycle Photo',   key: 'motorcycleImg', img: user?.motorcycleImg },
    { label: 'Profile Photo',      key: 'profileImg',    img: user?.profileImg    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 mb-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {user?.profileImg
              ? <img src={user.profileImg} className="w-14 h-14 rounded-full object-cover" alt="" />
              : (user?.name?.[0] || 'R')}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-orange-200 text-sm">{user?.phone}</p>
            <div className="mt-1"><StatusBadge status={user?.riderStatus || 'pending'} /></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Rating', value: user?.rating ? user.rating.toFixed(1) : '—', sub: `${user?.ratingCount || 0} reviews` },
            { label: 'Trips',  value: user?.totalTrips || 0, sub: 'completed' },
            { label: 'Earned', value: `$${(user?.earnings || 0).toFixed(0)}`, sub: 'total' },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold">{value}</p>
              <p className="text-xs text-orange-200">{label}</p>
              <p className="text-xs text-orange-300">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editable info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Rider Info</h2>
          {editing
            ? <div className="flex gap-2">
                <button onClick={() => setEditing(false)}><X className="w-4 h-4 text-gray-400" /></button>
                <button onClick={save}><Save className="w-4 h-4 text-green-500" /></button>
              </div>
            : <button onClick={() => setEditing(true)}><Edit3 className="w-4 h-4 text-orange-500" /></button>
          }
        </div>
        <div className="space-y-3">
          {[
            { key: 'name',       label: 'Full Name'        },
            { key: 'motorcycle', label: 'Motorcycle Model' },
            { key: 'plate',      label: 'Plate Number'     },
          ].map(({ key, label }) => (
            <div key={key}>
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              {editing
                ? <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                : <p className="text-sm font-medium text-gray-900">{user?.[key] || '—'}</p>
              }
            </div>
          ))}
          <div>
            <p className="text-xs text-gray-400 mb-1">License Number</p>
            <p className="text-sm font-medium text-gray-900">{user?.licenseNumber || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Member Since</p>
            <p className="text-sm font-medium text-gray-900">{fmtDate(user?.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Submitted Documents</h2>
        <div className="space-y-2">
          {docs.map(({ label, img }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${img ? 'bg-green-50' : 'bg-gray-50'}`}>
                {img ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Shield className="w-4 h-4 text-gray-300" />}
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">{label}</span>
              {img
                ? <img src={img} className="w-10 h-10 object-cover rounded-lg border border-gray-100" alt="" />
                : <span className="text-xs text-gray-400">Not uploaded</span>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
