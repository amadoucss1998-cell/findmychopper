import { useNavigate } from 'react-router-dom';
import { Clock, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PendingApproval() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() { logout(); navigate('/'); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Application Under Review</h1>
        <p className="text-gray-500 mb-2">Hi <strong>{user?.name}</strong>, your rider application has been submitted.</p>
        <p className="text-gray-400 text-sm mb-8">An admin will review your documents and approve your account. You'll be able to start accepting rides once approved.</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">What happens next</p>
          {[
            { step: '1', text: 'Admin reviews your ID and license' },
            { step: '2', text: 'You receive approval notification' },
            { step: '3', text: 'Go online and start earning' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-500">{step}</div>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 mx-auto transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
