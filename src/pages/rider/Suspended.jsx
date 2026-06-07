import { useNavigate } from 'react-router-dom';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Suspended({ rejected }) {
  const { logout } = useApp();
  const navigate   = useNavigate();
  function handleLogout() { logout(); navigate('/'); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          Account {rejected ? 'Rejected' : 'Suspended'}
        </h1>
        <p className="text-gray-500 mb-8">
          {rejected
            ? 'Your rider application was not approved. Please contact support for more information.'
            : 'Your rider account has been suspended. Please contact support to resolve this.'}
        </p>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 mx-auto">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
