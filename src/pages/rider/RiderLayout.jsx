import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Home, DollarSign, Clock, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RiderLayout() {
  const { user } = useApp();
  if (!user || user.role !== 'rider') return <Navigate to="/auth/login?role=rider" replace />;
  if (user.riderStatus === 'pending')   return <Navigate to="/rider/pending" replace />;
  if (user.riderStatus === 'suspended') return <Navigate to="/rider/suspended" replace />;
  if (user.riderStatus === 'rejected')  return <Navigate to="/rider/rejected" replace />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex shadow-lg z-50">
        {[
          { to: '/rider',          label: 'Home',     icon: Home,       end: true },
          { to: '/rider/earnings', label: 'Earnings', icon: DollarSign },
          { to: '/rider/trips',    label: 'Trips',    icon: Clock      },
          { to: '/rider/profile',  label: 'Profile',  icon: User       },
        ].map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`
            }>
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
