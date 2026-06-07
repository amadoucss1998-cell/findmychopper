import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Home, Clock, User, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PassengerLayout() {
  const { user } = useApp();
  if (!user || user.role !== 'passenger') return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex shadow-lg z-50">
        {[
          { to: '/passenger',         label: 'Home',    icon: Home,  end: true },
          { to: '/passenger/history', label: 'Trips',   icon: Clock },
          { to: '/passenger/profile', label: 'Profile', icon: User  },
          { to: '/passenger/sos',     label: 'SOS',     icon: Phone },
        ].map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors
               ${label === 'SOS' ? (isActive ? 'text-red-500' : 'text-red-400') : (isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600')}`
            }>
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
