import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../services/authService';
import { getApplicationStats, getProfilesCount } from '../../services/adminService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalProfiles: 0  // Add profiles count
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const { stats: appStats, error } = await getApplicationStats();
        const { count: profilesCount } = await getProfilesCount();

        if (!error && appStats) {
            setStats({
                ...appStats,
                totalProfiles: profilesCount || 0
            });
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('adminUser');
        localStorage.removeItem('isAdmin');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-gray-400 text-sm">Jain Matrimony Management</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Applications */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                                <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.total}</p>
                            </div>
                            <div className="bg-blue-500/30 p-3 rounded-full">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm font-medium">Pending Review</p>
                                <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.pending}</p>
                            </div>
                            <div className="bg-yellow-500/30 p-3 rounded-full">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Approved */}
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Approved</p>
                                <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.approved}</p>
                            </div>
                            <div className="bg-green-500/30 p-3 rounded-full">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Rejected */}
                    <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Rejected</p>
                                <p className="text-3xl font-bold mt-2">{loading ? '...' : stats.rejected}</p>
                            </div>
                            <div className="bg-red-500/30 p-3 rounded-full">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Profiles Card */}
                <Link to="/admin/profiles" className="block mb-8">
                    <div className="bg-gradient-to-br from-saffron to-orange-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Total Approved Profiles</p>
                                <p className="text-4xl font-bold mt-2">{loading ? '...' : stats.totalProfiles}</p>
                                <p className="text-orange-100 text-sm mt-2">Click to view all profiles →</p>
                            </div>
                            <div className="bg-orange-500/30 p-4 rounded-full">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/admin/applications/pending"
                            className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                        >
                            <div className="bg-yellow-600 p-3 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Review Pending</h3>
                                <p className="text-gray-400 text-sm">{stats.pending} applications waiting</p>
                            </div>
                        </Link>

                        <Link
                            to="/admin/applications/all"
                            className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                        >
                            <div className="bg-blue-600 p-3 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">All Applications</h3>
                                <p className="text-gray-400 text-sm">View complete history</p>
                            </div>
                        </Link>

                        <Link
                            to="/admin/applications/approved"
                            className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                        >
                            <div className="bg-green-600 p-3 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Approved Users</h3>
                                <p className="text-gray-400 text-sm">{stats.approved} active profiles</p>
                            </div>
                        </Link>

                        <Link
                            to="/admin/success-stories"
                            className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                        >
                            <div className="bg-pink-600 p-3 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Success Stories</h3>
                                <p className="text-gray-400 text-sm">Manage testimonials</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity - Placeholder */}
                <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <p className="text-gray-400">Activity log coming soon...</p>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
