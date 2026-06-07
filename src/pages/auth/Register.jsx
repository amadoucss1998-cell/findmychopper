import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ChevronLeft, Upload, Bike, FileText, Car, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { friendlyError } from '../../lib/supabase';

// ── Shared fields ─────────────────────────────────────────────────────────────
function EmailPasswordFields({ email, setEmail, password, setPassword, phone, setPhone, errors }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email"
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters" autoComplete="new-password"
            className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.password ? 'border-red-400' : 'border-gray-200'}`} />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-gray-400 font-normal">(for SMS verification)</span></label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="+231 77 000 0000"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
      </div>
    </>
  );
}

// ── Passenger registration ────────────────────────────────────────────────────
function PassengerForm({ onSubmit, loading }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [phone,    setPhone]    = useState('');
  const [errors,   setErrors]   = useState({});

  function submit(e) {
    e.preventDefault();
    const e2 = {};
    if (!name.trim())         e2.name     = 'Required';
    if (!email.trim())        e2.email    = 'Required';
    if (password.length < 8)  e2.password = 'At least 8 characters';
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), password, phone: phone.trim(), role: 'passenger' });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input value={name} onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: '' })); }}
          placeholder="e.g. Mariama Kamara"
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <EmailPasswordFields email={email} setEmail={setEmail} password={password} setPassword={setPassword}
        phone={phone} setPhone={setPhone} errors={errors} />
      <button type="submit" disabled={loading}
        className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60">
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}

// ── Rider multi-step registration ─────────────────────────────────────────────
function RiderForm({ onSubmit, loading }) {
  const [step,  setStep]  = useState(1);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [phone,    setPhone]    = useState('');
  const [form,  setForm]  = useState({
    name: '', motorcycle: '', plate: '', licenseNumber: '',
    nationalId: '', licenseImg: '', motorcycleImg: '', profileImg: '',
  });
  const [errors, setErrors] = useState({});

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); }

  function readFile(k, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set(k, reader.result);
    reader.readAsDataURL(file);
  }

  function validateStep1() {
    const e = {};
    if (!form.name.trim())         e.name          = 'Required';
    if (!email.trim())             e.email         = 'Required';
    if (password.length < 8)       e.password      = 'At least 8 characters';
    if (!form.licenseNumber.trim()) e.licenseNumber = 'Required';
    if (Object.keys(e).length) { setErrors(e); return false; }
    return true;
  }

  function validateStep2() {
    const e = {};
    if (!form.motorcycle.trim()) e.motorcycle = 'Required';
    if (!form.plate.trim())      e.plate      = 'Required';
    if (Object.keys(e).length) { setErrors(e); return false; }
    return true;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  }

  function submit() {
    onSubmit({
      name: form.name.trim(), email: email.trim().toLowerCase(), password, phone: phone.trim(),
      role: 'rider', motorcycle: form.motorcycle.trim(),
      plate: form.plate.trim().toUpperCase(), licenseNumber: form.licenseNumber.trim(),
      nationalId: form.nationalId, licenseImg: form.licenseImg,
      motorcycleImg: form.motorcycleImg, profileImg: form.profileImg,
      riderStatus: 'pending', rating: 0, ratingCount: 0, totalTrips: 0, earnings: 0,
    });
  }

  const FileInput = ({ label, fieldKey, icon: Icon }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${form[fieldKey] ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-orange-300'}`}>
        {form[fieldKey]
          ? <img src={form[fieldKey]} alt="" className="w-10 h-10 object-cover rounded-lg" />
          : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-gray-400" /></div>}
        <span className="text-sm text-gray-500">{form[fieldKey] ? 'Photo uploaded ✓' : 'Tap to upload'}</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => readFile(fieldKey, e.target.files[0])} />
      </label>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {[1,2,3].map(n => (
          <div key={n} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${n <= step ? 'bg-orange-500' : 'bg-gray-200'}`} />
            <p className={`text-xs mt-1 text-center ${n === step ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
              {n === 1 ? 'Account' : n === 2 ? 'Vehicle' : 'Documents'}
            </p>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. James Kollie"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <EmailPasswordFields email={email} setEmail={setEmail} password={password} setPassword={setPassword}
            phone={phone} setPhone={setPhone} errors={errors} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Driver License Number</label>
            <input value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} placeholder="e.g. LB-DL-00123"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.licenseNumber ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
          </div>
          <button onClick={next} className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600">Next →</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Motorcycle Model</label>
            <input value={form.motorcycle} onChange={e => set('motorcycle', e.target.value)} placeholder="e.g. Honda CB150"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.motorcycle ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.motorcycle && <p className="text-red-500 text-xs mt-1">{errors.motorcycle}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Plate Number</label>
            <input value={form.plate} onChange={e => set('plate', e.target.value)} placeholder="e.g. LB-2301"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.plate ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.plate && <p className="text-red-500 text-xs mt-1">{errors.plate}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</button>
            <button onClick={next} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600">Next →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
            Upload photos for verification. Your account will be reviewed by an admin.
          </p>
          <FileInput label="Profile Photo"    fieldKey="profileImg"   icon={User}     />
          <FileInput label="National ID"      fieldKey="nationalId"   icon={FileText} />
          <FileInput label="Driver's License" fieldKey="licenseImg"   icon={FileText} />
          <FileInput label="Motorcycle Photo" fieldKey="motorcycleImg" icon={Car}     />
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</button>
            <button onClick={submit} disabled={loading} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60">
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin registration ────────────────────────────────────────────────────────
function AdminForm({ onSubmit, loading }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState({});

  function submit(e) {
    e.preventDefault();
    const e2 = {};
    if (!name.trim())        e2.name     = 'Required';
    if (!email.trim())       e2.email    = 'Required';
    if (password.length < 8) e2.password = 'At least 8 characters';
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), password, role: 'admin' });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input value={name} onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: '' })); }}
          placeholder="e.g. Admin User"
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <EmailPasswordFields email={email} setEmail={setEmail} password={password} setPassword={setPassword}
        phone="" setPhone={() => {}} errors={errors} />
      <button type="submit" disabled={loading}
        className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60">
        {loading ? 'Creating admin…' : 'Create Admin Account'}
      </button>
    </form>
  );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────
export default function Register() {
  const [role,    setRole]    = useState('passenger');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { signUp } = useApp();
  const navigate   = useNavigate();

  async function handleSubmit({ password, ...profileData }) {
    setLoading(true);
    setError('');
    try {
      await signUp(profileData.email, password, profileData);
      if (profileData.role === 'rider') navigate('/rider/pending', { replace: true });
      else if (profileData.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/passenger', { replace: true });
    } catch (err) {
      setError(friendlyError(err));
      setLoading(false);
    }
  }

  const tabs = [
    { key: 'passenger', label: 'Passenger' },
    { key: 'rider',     label: 'Rider'     },
    { key: 'admin',     label: 'Admin'     },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/auth/login')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to sign in
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-400 mt-1">Choose your role to get started</p>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setRole(t.key)}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${role === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          {role === 'passenger' && <PassengerForm onSubmit={handleSubmit} loading={loading} />}
          {role === 'rider'     && <RiderForm     onSubmit={handleSubmit} loading={loading} />}
          {role === 'admin'     && <AdminForm     onSubmit={handleSubmit} loading={loading} />}

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
