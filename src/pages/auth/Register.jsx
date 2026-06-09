import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, ChevronLeft, Upload, Bike, FileText, Car } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ── Passenger registration ────────────────────────────────────────────────────
function PassengerForm({ phone, onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Enter your full name'); return; }
    onSubmit({ name: name.trim(), phone, role: 'passenger' });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input value={name} onChange={e => { setName(e.target.value); setError(''); }}
          placeholder="e.g. Mariama Kamara"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
        <input value={phone} readOnly className="w-full px-4 py-3 border border-gray-100 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed" />
      </div>
      <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
        Create Account
      </button>
    </form>
  );
}

// ── Rider multi-step registration ─────────────────────────────────────────────
function RiderForm({ phone, onSubmit }) {
  const [step,  setStep]  = useState(1);
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
    if (!form.name.trim())         e.name = 'Required';
    if (!form.licenseNumber.trim()) e.licenseNumber = 'Required';
    if (Object.keys(e).length) { setErrors(e); return false; }
    return true;
  }

  function validateStep2() {
    const e = {};
    if (!form.motorcycle.trim()) e.motorcycle = 'Required';
    if (!form.plate.trim())      e.plate = 'Required';
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
      name: form.name.trim(),
      phone,
      role: 'rider',
      motorcycle: form.motorcycle.trim(),
      plate: form.plate.trim().toUpperCase(),
      licenseNumber: form.licenseNumber.trim(),
      nationalId: form.nationalId,
      licenseImg: form.licenseImg,
      motorcycleImg: form.motorcycleImg,
      profileImg: form.profileImg,
      riderStatus: 'pending',
      rating: 0,
      ratingCount: 0,
      totalTrips: 0,
      earnings: 0,
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
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1,2,3].map(n => (
          <div key={n} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${n <= step ? 'bg-orange-500' : 'bg-gray-200'}`} />
            <p className={`text-xs mt-1 text-center ${n === step ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
              {n === 1 ? 'Personal' : n === 2 ? 'Vehicle' : 'Documents'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input value={phone} readOnly className="w-full px-4 py-3 border border-gray-100 bg-gray-50 rounded-xl text-gray-500" />
          </div>
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
            Upload photos of your documents for verification. Your account will be reviewed by an admin.
          </p>
          <FileInput label="Profile Photo" fieldKey="profileImg" icon={User} />
          <FileInput label="National ID" fieldKey="nationalId" icon={FileText} />
          <FileInput label="Driver's License" fieldKey="licenseImg" icon={FileText} />
          <FileInput label="Motorcycle Photo" fieldKey="motorcycleImg" icon={Car} />
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</button>
            <button onClick={submit} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600">Submit Application</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────
export default function Register() {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const role  = searchParams.get('role')  || 'passenger';

  const { createUser, loginWithUser } = useApp();
  const navigate = useNavigate();

  function handleSubmit(data) {
    const user = createUser(data);
    loginWithUser(user);
    if (user.role === 'rider') navigate('/rider/pending', { replace: true });
    else                       navigate('/passenger',     { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">
              {role === 'rider' ? 'Rider Registration' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {role === 'rider' ? 'Complete all 3 steps to apply' : 'Just your name to get started'}
            </p>
          </div>

          {role === 'rider'
            ? <RiderForm phone={phone} onSubmit={handleSubmit} />
            : <PassengerForm phone={phone} onSubmit={handleSubmit} />}
        </div>
      </div>
    </div>
  );
}
