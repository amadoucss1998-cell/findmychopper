import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { supabase } from './lib/supabase';

import Landing  from './pages/Landing';
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

import PassengerLayout from './pages/passenger/PassengerLayout';
import PassengerHome   from './pages/passenger/Home';
import History         from './pages/passenger/History';
import Profile         from './pages/passenger/Profile';
import SOS             from './pages/passenger/SOS';

import RiderLayout     from './pages/rider/RiderLayout';
import RiderHome       from './pages/rider/RiderHome';
import RiderEarnings   from './pages/rider/RiderEarnings';
import RiderTrips      from './pages/rider/RiderTrips';
import RiderProfile    from './pages/rider/RiderProfile';
import PendingApproval from './pages/rider/PendingApproval';
import Suspended       from './pages/rider/Suspended';

import AdminLayout  from './pages/admin/AdminLayout';
import Dashboard    from './pages/admin/Dashboard';
import Riders       from './pages/admin/Riders';
import Passengers   from './pages/admin/Passengers';
import Trips        from './pages/admin/Trips';
import Revenue      from './pages/admin/Revenue';

function OfflineBanner() {
  const [status, setStatus] = useState('checking'); // checking | ok | auth-fail | db-fail | offline

  useEffect(() => {
    async function diagnose() {
      // 1. Test auth endpoint
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: '__probe__@test.invalid', password: 'probe',
      });
      if (authErr?.message === 'Failed to fetch') {
        console.error('[FMC] Auth endpoint unreachable:', authErr);
        setStatus('offline');
        return;
      }
      // authErr here is expected ("Invalid login credentials") — that means auth works

      // 2. Test database (users table)
      const { error: dbErr } = await supabase.from('users').select('id').limit(1);
      if (dbErr) {
        console.error('[FMC] DB error:', dbErr);
        if (dbErr.message === 'Failed to fetch') { setStatus('offline'); return; }
        if (dbErr.code === 'PGRST200' || dbErr.message?.includes('relation') || dbErr.message?.includes('does not exist')) {
          setStatus('db-fail'); return;
        }
      }
      setStatus('ok');
    }
    diagnose();
  }, []);

  if (status === 'checking' || status === 'ok') return null;

  const msgs = {
    offline:  { bg: 'bg-red-500',    text: '⚠️ Cannot reach Supabase. Project may be paused.', link: 'Restore project →' },
    'db-fail':{ bg: 'bg-amber-500',  text: '⚠️ Database tables missing. You need to run the setup SQL.', link: 'Open SQL Editor →' },
  };
  const m = msgs[status] || msgs.offline;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] ${m.bg} text-white text-sm px-4 py-2.5 flex items-center justify-between gap-4 shadow-lg`}>
      <span>{m.text}</span>
      <a href="https://supabase.com/dashboard/project/bzgekboxmlybkbnfnjv" target="_blank" rel="noreferrer"
        className="underline font-semibold whitespace-nowrap hover:opacity-80">{m.link}</a>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <OfflineBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route path="/auth/login"    element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Passenger */}
          <Route path="/passenger" element={<PassengerLayout />}>
            <Route index          element={<PassengerHome />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="sos"     element={<SOS />} />
          </Route>

          {/* Rider */}
          <Route path="/rider/pending"   element={<PendingApproval />} />
          <Route path="/rider/suspended" element={<Suspended />} />
          <Route path="/rider/rejected"  element={<Suspended rejected />} />
          <Route path="/rider" element={<RiderLayout />}>
            <Route index           element={<RiderHome />} />
            <Route path="earnings" element={<RiderEarnings />} />
            <Route path="trips"    element={<RiderTrips />} />
            <Route path="profile"  element={<RiderProfile />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index             element={<Dashboard />} />
            <Route path="riders"     element={<Riders />} />
            <Route path="passengers" element={<Passengers />} />
            <Route path="trips"      element={<Trips />} />
            <Route path="revenue"    element={<Revenue />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
