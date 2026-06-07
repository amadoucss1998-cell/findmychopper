import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bike, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, role, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const isLanding = location.pathname === '/';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-500 rounded-xl p-1.5">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">FindMyChopper</span>
          </Link>

          <div className="flex items-center gap-3">
            {!user && isLanding && (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5">
                  Sign In
                </Link>
                <Link to="/login?role=admin" className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 font-medium">
                  Admin
                </Link>
              </>
            )}

            {user && role === 'passenger' && (
              <>
                <Link to="/passenger" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 font-medium">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/passenger/profile" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 font-medium">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}

            {user && role === 'admin' && (
              <>
                <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 font-medium">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
