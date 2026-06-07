import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';

import Landing from './pages/Landing';
import Login from './pages/Login';

import PassengerLayout from './pages/passenger/PassengerLayout';
import PassengerHome from './pages/passenger/Home';
import History from './pages/passenger/History';
import Profile from './pages/passenger/Profile';
import SOS from './pages/passenger/SOS';

import RiderLayout from './pages/rider/RiderLayout';
import RiderHome from './pages/rider/RiderHome';
import RiderEarnings from './pages/rider/RiderEarnings';
import RiderTrips from './pages/rider/RiderTrips';
import RiderProfile from './pages/rider/RiderProfile';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Riders from './pages/admin/Riders';
import Passengers from './pages/admin/Passengers';
import Trips from './pages/admin/Trips';
import Revenue from './pages/admin/Revenue';

function WithNav({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.VITE_BASE_URL || '/'}>
        <Routes>
          <Route path="/" element={<WithNav><Landing /></WithNav>} />
          <Route path="/login" element={<WithNav><Login /></WithNav>} />

          <Route path="/passenger" element={<PassengerLayout />}>
            <Route index element={<PassengerHome />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="sos" element={<SOS />} />
          </Route>

          <Route path="/rider" element={<RiderLayout />}>
            <Route index element={<RiderHome />} />
            <Route path="earnings" element={<RiderEarnings />} />
            <Route path="trips" element={<RiderTrips />} />
            <Route path="profile" element={<RiderProfile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="riders" element={<Riders />} />
            <Route path="passengers" element={<Passengers />} />
            <Route path="trips" element={<Trips />} />
            <Route path="revenue" element={<Revenue />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
