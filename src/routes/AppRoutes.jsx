import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ResetPassword from '../pages/ResetPassword';
import Home from '../pages/Home';
import BrowseProfiles from '../pages/BrowseProfiles';
import ProfileDetail from '../pages/ProfileDetail';
import MyProfile from '../pages/MyProfile';
import Interests from '../pages/Interests';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import PendingApplications from '../pages/admin/PendingApplications';
import ReviewApplication from '../pages/admin/ReviewApplication';
import AllProfiles from '../pages/admin/AllProfiles';
import AdminProfileDetail from '../pages/admin/ProfileDetail';
import SuccessStoriesManagement from '../pages/admin/SuccessStoriesManagement';

// Simple auth check
const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('user');

    if (!isLoggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public route check (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('user');

    if (isLoggedIn && user) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

// Admin auth check
const AdminRoute = ({ children }) => {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin ? children : <Navigate to="/admin" replace />;
};

const AppRoutes = () => {
    // Check if we're on admin subdomain
    const isAdminSubdomain = window.location.hostname.startsWith('admin.');

    // If on admin subdomain, show only admin routes
    if (isAdminSubdomain) {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/applications/:status"
                        element={
                            <AdminRoute>
                                <PendingApplications />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/review/:id"
                        element={
                            <AdminRoute>
                                <ReviewApplication />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/profiles"
                        element={
                            <AdminRoute>
                                <AllProfiles />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/profile/:userId"
                        element={
                            <AdminRoute>
                                <AdminProfileDetail />
                            </AdminRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </Router>
        );
    }

    // Regular app routes
    return (
        <Router>
            <Routes>
                {/* Root - redirect based on auth status */}
                <Route
                    path="/"
                    element={
                        localStorage.getItem('isLoggedIn') ?
                            <Navigate to="/home" replace /> :
                            <Navigate to="/login" replace />
                    }
                />

                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <PublicRoute>
                            <ResetPassword />
                        </PublicRoute>
                    }
                />

                {/* Admin Routes (accessible via /admin path on main domain) */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/applications/:status"
                    element={
                        <AdminRoute>
                            <PendingApplications />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/review/:id"
                    element={
                        <AdminRoute>
                            <ReviewApplication />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/profiles"
                    element={
                        <AdminRoute>
                            <AllProfiles />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/profile/:userId"
                    element={
                        <AdminRoute>
                            <AdminProfileDetail />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/success-stories"
                    element={
                        <AdminRoute>
                            <SuccessStoriesManagement />
                        </AdminRoute>
                    }
                />


                {/* Protected Routes */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/browse-profiles"
                    element={
                        <ProtectedRoute>
                            <BrowseProfiles />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:id"
                    element={
                        <ProtectedRoute>
                            <ProfileDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-profile"
                    element={
                        <ProtectedRoute>
                            <MyProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/interests"
                    element={
                        <ProtectedRoute>
                            <Interests />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all - redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;

