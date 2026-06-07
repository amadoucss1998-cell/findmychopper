import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, RefreshCw, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function VerifyPhone() {
  const { user, verifyPhoneOTP, sendPhoneOTP, updateProfile } = useApp();
  const navigate = useNavigate();

  const [phone,   setPhone]   = useState(user?.phone || '');
  const [digits,  setDigits]  = useState(['','','','','','']);
  const [step,    setStep]    = useState(user?.phone ? 'otp' : 'phone');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resent,  setResent]  = useState(false);
  const [devCode, setDevCode] = useState(null); // shown when Edge Function not deployed
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === 'otp') inputRefs.current[0]?.focus();
  }, [step]);

  // Auto-send OTP if phone already on profile (coming from register)
  useEffect(() => {
    if (step === 'otp' && user?.phone) handleSend(user.phone);
  }, []);

  async function handleSend(ph) {
    setLoading(true);
    setError('');
    setDevCode(null);
    try {
      const result = await sendPhoneOTP(ph || phone);
      if (result.devMode) setDevCode(result.otp); // SMS fallback: show code in UI
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send code');
    }
    setLoading(false);
  }

  function handleChange(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError('');
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      const valid = await verifyPhoneOTP(phone || user?.phone, code);
      if (!valid) { setError('Incorrect code. Try again.'); setLoading(false); return; }
      await updateProfile({ phoneVerified: true, phone: phone || user?.phone });
      if (user?.role === 'rider') navigate('/rider/pending', { replace: true });
      else                        navigate('/passenger',     { replace: true });
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
    setLoading(false);
  }

  async function resend() {
    setDigits(['','','','','','']);
    setResent(true);
    await handleSend(phone || user?.phone);
    setTimeout(() => setResent(false), 30000);
  }

  function skipVerification() {
    if (user?.role === 'rider') navigate('/rider/pending', { replace: true });
    else                        navigate('/passenger',     { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 rounded-2xl p-4">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          {step === 'phone' ? (
            <>
              <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">Verify your phone</h2>
              <p className="text-gray-400 text-sm text-center mb-6">We'll send a code to confirm your number</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+231 77 000 0000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button onClick={() => handleSend(phone)} disabled={loading || !phone}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60">
                  {loading ? 'Sending…' : 'Send Code'}
                </button>
                <button onClick={skipVerification} className="w-full text-gray-400 text-sm hover:text-gray-600 py-2">
                  Skip for now
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">Enter the code</h2>
              <p className="text-gray-400 text-sm text-center mb-1">
                Sent to <span className="font-medium text-gray-700">{phone || user?.phone}</span>
              </p>

              {/* Dev mode fallback — shown when Edge Function isn't deployed yet */}
              {devCode && (
                <div className="mt-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700">SMS not configured yet</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Deploy the Edge Function to send real SMS. Your code for now:{' '}
                      <span className="font-mono font-bold tracking-widest text-amber-800">{devCode}</span>
                    </p>
                  </div>
                </div>
              )}

              {!devCode && (
                <p className="text-xs text-gray-400 text-center mb-4">Check your messages</p>
              )}

              <form onSubmit={handleVerify}>
                <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
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
                      className={`w-11 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors
                        ${d ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'}`}
                    />
                  ))}
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <button type="submit" disabled={loading || digits.join('').length < 6}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60 mb-4">
                  {loading ? 'Verifying…' : 'Verify'}
                </button>
              </form>

              <div className="flex items-center justify-between text-sm">
                <button onClick={resend} disabled={resent || loading}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 disabled:opacity-40 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resent ? 'Code sent!' : 'Resend code'}
                </button>
                <button onClick={skipVerification} className="text-gray-400 hover:text-gray-600">
                  Skip for now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
