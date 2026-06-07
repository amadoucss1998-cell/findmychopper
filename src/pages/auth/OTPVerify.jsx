import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, ChevronLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OTPVerify() {
  const [searchParams]        = useSearchParams();
  const phone                 = searchParams.get('phone') || '';
  const role                  = searchParams.get('role') || 'passenger';

  const [digits,  setDigits]  = useState(['','','','','','']);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [resent,  setResent]  = useState(false);
  const inputRefs             = useRef([]);

  const { verifyOTP, findUserByPhone, loginWithUser, sendOTP, otpCode } = useApp();
  const navigate = useNavigate();

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function handleChange(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError('');
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) { setError('Enter the 6-digit code'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const valid = await verifyOTP(phone, code);
    if (!valid) { setError('Incorrect code. Try again.'); setLoading(false); return; }

    const existing = await findUserByPhone(phone);
    setLoading(false);

    if (existing) {
      await loginWithUser(existing);
      if (existing.role === 'admin')     navigate('/admin', { replace: true });
      else if (existing.role === 'rider') navigate('/rider', { replace: true });
      else                                navigate('/passenger', { replace: true });
    } else {
      navigate(`/auth/register?phone=${encodeURIComponent(phone)}&role=${role}`, { replace: true });
    }
  }

  function resend() {
    sendOTP(phone);
    setResent(true);
    setDigits(['','','','','','']);
    setTimeout(() => setResent(false), 30000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-orange-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">Verify your number</h2>
            <p className="text-sm text-gray-400 mt-1">Code sent to <span className="font-medium text-gray-700">{phone}</span></p>
          </div>

          {/* SMS preview box */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">FindMyChopper SMS</p>
              <p className="text-sm text-gray-700">
                Your verification code is{' '}
                <span className="font-mono font-bold text-gray-900 text-base tracking-widest">{otpCode || '------'}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Expires in 5 minutes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${d ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-900'} focus:border-orange-500`}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60">
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>
          </form>

          <div className="text-center mt-4">
            {resent ? (
              <p className="text-xs text-green-500">New code sent ✓</p>
            ) : (
              <button onClick={resend} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 mx-auto transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Resend code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
