import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bike, Users, Car, DollarSign, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/riders',     label: 'Riders',     icon: Bike   },
  { to: '/admin/passengers', label: 'Passengers', icon: Users  },
  { to: '/admin/trips',      label: 'Trips',      icon: Car    },
  { to: '/admin/revenue',    label: 'Revenue',    icon: DollarSign },
];

export default function AdminLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/auth/login?role=admin" replace />;

  function handleLogout() { logout(); navigate('/'); }

  const Sidebar = ({ mobile }) => (
    <>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 rounded-xl p-1.5"><Bike className="w-5 h-5 text-white" /></div>
          <div>
            <p className="font-bold text-gray-900 text-sm">FindMyChopper</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => mobile && setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            <Icon className="w-4 h-4" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.phone}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:flex w-60 bg-white border-r border-gray-100 flex-col fixed h-full z-30">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-60 bg-white h-full flex flex-col shadow-xl">
            <button className="absolute top-4 right-4 z-10" onClick={() => setOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-60 min-w-0">
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Menu className="w-5 h-5 text-gray-600" /></button>
          <p className="font-semibold text-gray-900 text-sm">Admin Panel</p>
        </div>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
