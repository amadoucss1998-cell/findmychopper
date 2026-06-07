import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Bike, Phone, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'passenger';

  const [step, setStep] = useState('phone'); // phone | otp
  const [role, setRole] = useState(defaultRole);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useApp();
  const navigate = useNavigate();

  function sendOtp(e) {
    e.preventDefault();
    if (phone.length < 8) { setError('Enter a valid phone number'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1000);
  }

  function verifyOtp(e) {
    e.preventDefault();
    if (otp.length < 4) { setError('Enter the 6-digit code'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        login({ name: 'Admin User', phone }, 'admin');
        navigate('/admin');
      } else if (role === 'rider') {
        login({ name: 'Rider User', phone }, 'rider');
        navigate('/rider');
      } else {
        login({ name: 'Mariama Kamara', phone }, 'passenger');
        navigate('/passenger');
      }
    }, 1000);
  }

  const tabs = [
    { key: 'passenger', label: 'Passenger' },
    { key: 'rider', label: 'Rider' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-orange-500 rounded-2xl p-3 mb-4 shadow-lg">
            <Bike className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">FindMyChopper</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Role tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => { setRole(t.key); setStep('phone'); setError(''); }}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${role === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {step === 'phone' ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+231 77 000 0000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'Sending...' : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <p className="text-xs text-gray-400 mb-3">Code sent to {phone} <button type="button" onClick={() => setStep('phone')} className="text-orange-500 hover:underline">Change</button></p>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">Demo: enter any 4+ digit code</p>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'Verifying...' : <><Shield className="w-4 h-4" /><span>Verify & Sign In</span></>}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <Link to="#" className="text-orange-500 hover:underline">Terms</Link> and{' '}
          <Link to="#" className="text-orange-500 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
