import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProfiles } from '../../services/adminService';

const AllProfiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');

    useEffect(() => {
        loadProfiles();
    }, [genderFilter]);

    const loadProfiles = async () => {
        setLoading(true);
        const filters = {
            gender: genderFilter || undefined,
            search: searchTerm || undefined
        };

        const { profiles: data, error } = await getAllProfiles(filters);

        if (!error && data) {
            setProfiles(data);
        }
        setLoading(false);
    };

    const handleSearch = () => {
        loadProfiles();
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">All Approved Profiles</h1>
                            <p className="text-gray-400 text-sm">Total: {profiles.length} profiles</p>
                        </div>
                        <Link
                            to="/admin/dashboard"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Search by Name or Email
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron"
                                    placeholder="Search profiles..."
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded-lg transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Filter by Gender
                            </label>
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                            >
                                <option value="">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Profiles Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                        <p className="text-gray-400 mt-4">Loading profiles...</p>
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center border border-gray-700">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-xl font-semibold text-white mb-2">No Profiles Found</h3>
                        <p className="text-gray-400">No approved profiles match your search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map((profile) => (
                            <Link
                                key={profile.id}
                                to={`/admin/profile/${profile.user_id}`}
                                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-saffron transition-colors cursor-pointer"
                            >
                                {/* Profile Photo */}
                                <div className="h-48 bg-gray-700 relative">
                                    {profile.profile_photo_url ? (
                                        <img
                                            src={profile.profile_photo_url}
                                            alt={profile.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-20 h-20 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${profile.users.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                            }`}>
                                            {profile.users.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">{profile.full_name || 'N/A'}</h3>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-300">
                                            <svg className="w-4 h-4 mr-2 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {profile.gender || 'N/A'} • {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN', { year: 'numeric' }) : 'N/A'}
                                        </div>

                                        <div className="flex items-center text-gray-300">
                                            <svg className="w-4 h-4 mr-2 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {profile.city || 'N/A'}, {profile.state || 'N/A'}
                                        </div>

                                        <div className="flex items-center text-gray-300">
                                            <svg className="w-4 h-4 mr-2 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {profile.occupation || 'N/A'}
                                        </div>

                                        <div className="flex items-center text-gray-300">
                                            <svg className="w-4 h-4 mr-2 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {profile.users.email}
                                        </div>

                                        <div className="flex items-center text-gray-300">
                                            <svg className="w-4 h-4 mr-2 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {profile.users.phone}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-xs text-gray-500">
                                            Joined: {new Date(profile.users.created_at).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AllProfiles;
