import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Landing     from './pages/Landing';
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

export default function App() {
  return (
    <AppProvider>
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
