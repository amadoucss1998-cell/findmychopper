import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { friendlyError } from '../../lib/supabase';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const { signIn } = useApp();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Enter your email and password'); return; }
    setError('');
    setLoading(true);
    try {
      const user = await signIn(email.trim().toLowerCase(), password);
      if (user.role === 'admin')     navigate('/admin',     { replace: true });
      else if (user.role === 'rider') navigate('/rider',     { replace: true });
      else                            navigate('/passenger', { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    }
    setLoading(false);
  }

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
          <h2 className="text-lg font-bold text-gray-900 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-orange-500 font-semibold hover:text-orange-600">
                Create one
              </Link>
            </p>
          </div>
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
