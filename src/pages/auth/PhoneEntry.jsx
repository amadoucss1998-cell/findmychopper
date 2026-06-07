import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Bike, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtPhone } from '../../lib/utils';

export default function PhoneEntry() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'passenger';

  const [role,    setRole]    = useState(defaultRole);
  const [phone,   setPhone]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { sendOTP } = useApp();
  const navigate    = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const formatted = fmtPhone(phone.trim());
    if (formatted.replace(/\D/g,'').length < 8) {
      setError('Enter a valid phone number'); return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      sendOTP(formatted);
      setLoading(false);
      navigate(`/auth/otp?phone=${encodeURIComponent(formatted)}&role=${role}`);
    }, 600);
  }

  const tabs = [
    { key: 'passenger', label: 'Passenger' },
    { key: 'rider',     label: 'Rider' },
    { key: 'admin',     label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex bg-orange-500 rounded-2xl p-3 mb-4 shadow-lg">
            <Bike className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">FindMyChopper</h1>
          <p className="text-gray-400 text-sm mt-1">Motorcycle rides across Liberia</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setRole(t.key)}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${role === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {role === 'admin' && (
            <div className="bg-blue-50 rounded-xl p-3 mb-4 text-center">
              <p className="text-xs text-blue-600 font-medium">Admin demo account</p>
              <p className="text-sm font-mono text-blue-800 mt-0.5">+231000000000</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                  placeholder="+231 77 000 0000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? 'Sending…' : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing you agree to our{' '}
          <Link to="#" className="text-orange-500">Terms</Link> &{' '}
          <Link to="#" className="text-orange-500">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
