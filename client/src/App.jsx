import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import HallOwnerLayout from './layouts/HallOwnerLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Components
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import GoogleCallback from './features/auth/GoogleCallback';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPendingHallOwnersPage from './pages/AdminPendingHallOwnersPage';
import AdminEnquiriesPage from './pages/AdminEnquiriesPage';
import AdminHallsPage from './pages/AdminHallsPage';
import LandingPage from './pages/LandingPage';

// Hall Owner Pages
import HallOwnerDashboardPage from './pages/HallOwnerDashboardPage';
import HallOwnerHallsPage from './pages/HallOwnerHallsPage';
import HallOwnerMenusPage from './pages/HallOwnerMenusPage';
import HallOwnerEventTypesPage from './pages/HallOwnerEventTypesPage';
import HallOwnerTimeSlotsPage from './pages/HallOwnerTimeSlotsPage';
import HallOwnerBookingsPage from './pages/HallOwnerBookingsPage';
import HallOwnerAddOnsPage from './pages/HallOwnerAddOnsPage';

// Customer Pages
import CustomerDashboardPage from './pages/CustomerDashboardPage.jsx';
import CustomerHallsPage from './pages/CustomerHallsPage.jsx';
import CustomerHallDetailsPage from './pages/CustomerHallDetailsPage.jsx';
import CustomerBookingsPage from './pages/CustomerBookingsPage.jsx';
import CustomerReviewsPage from './pages/CustomerReviewsPage.jsx';
import BookingPage from './features/customer/BookingPage';

// Create theme
function App() {
  return (
    <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/google-callback" element={<GoogleCallback />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="pending-hall-owners" element={<AdminPendingHallOwnersPage />} />
                    <Route path="enquiries" element={<AdminEnquiriesPage />} />
                    <Route path="halls" element={<AdminHallsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Hall Owner Routes */}
          <Route
            path="/hall-owner/*"
            element={
              <ProtectedRoute allowedRoles={['hall_owner']}>
                <HallOwnerLayout>
                  <Routes>
                    <Route path="dashboard" element={<HallOwnerDashboardPage />} />
                    <Route path="halls" element={<HallOwnerHallsPage />} />
                    <Route path="menus" element={<HallOwnerMenusPage />} />
                    <Route path="event-types" element={<HallOwnerEventTypesPage />} />
                    <Route path="time-slots" element={<HallOwnerTimeSlotsPage />} />
                    <Route path="bookings" element={<HallOwnerBookingsPage />} />
                    <Route path="add-ons" element={<HallOwnerAddOnsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </HallOwnerLayout>
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerLayout>
                  <Routes>
                    <Route path="dashboard" element={<CustomerDashboardPage />} />
                    <Route path="halls" element={<CustomerHallsPage />} />
                    <Route path="halls/:id" element={<CustomerHallDetailsPage />} />
                    <Route path="booking/:id" element={<BookingPage />} />
                    <Route path="bookings" element={<CustomerBookingsPage />} />
                    <Route path="reviews" element={<CustomerReviewsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
}

export default App;
