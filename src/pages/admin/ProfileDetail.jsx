import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProfileByUserId, deleteUserProfile } from '../../services/adminService';

const ProfileDetail = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        const { profile: data, error } = await getProfileByUserId(userId);

        if (!error && data) {
            setProfile(data);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setDeleting(true);

        const { success, error } = await deleteUserProfile(userId);

        if (success) {
            alert('User profile deleted successfully');
            navigate('/admin/profiles');
        } else {
            alert(`Delete failed: ${error}`);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                    <p className="text-gray-400 mt-4">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
                    <Link to="/admin/profiles" className="text-saffron hover:underline">
                        ← Back to Profiles
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Profile Details</h1>
                            <p className="text-gray-400 text-sm">{profile.full_name}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                🗑️ Delete Profile
                            </button>
                            <Link
                                to="/admin/profiles"
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                ← Back
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Photos */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Photo */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-4">Profile Photo</h3>
                            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                                {profile.profile_photo_url ? (
                                    <img
                                        src={profile.profile_photo_url}
                                        alt={profile.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* All Photos */}
                        {profile.photo_urls && profile.photo_urls.length > 0 && (
                            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4">All Photos ({profile.photo_urls.length})</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {profile.photo_urls.map((url, index) => (
                                        <div key={index} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                                            <img
                                                src={url}
                                                alt={`Photo ${index + 1}`}
                                                className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                                onClick={() => window.open(url, '_blank')}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Biodata PDF */}
                        {profile.biodata_pdf_url && (
                            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4">Biodata PDF</h3>
                                <a
                                    href={profile.biodata_pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-4 py-3 bg-saffron hover:bg-saffron-dark text-white rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    View Biodata PDF
                                </a>
                            </div>
                        )}

                        {/* Account Status */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-4">Account Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Active</span>
                                    <span className={`px-3 py-1 rounded text-sm font-semibold ${profile.users.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                        }`}>
                                        {profile.users.is_active ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Verified</span>
                                    <span className={`px-3 py-1 rounded text-sm font-semibold ${profile.users.is_verified ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                        }`}>
                                        {profile.users.is_verified ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Role</span>
                                    <span className="text-white font-semibold">{profile.users.role}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Joined</span>
                                    <span className="text-white">{new Date(profile.users.created_at).toLocaleDateString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Login Credentials */}
                        <div className="bg-gradient-to-br from-saffron/10 to-orange-600/10 rounded-lg shadow-lg p-6 border border-saffron/30">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Login Credentials
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Email</p>
                                    <div className="flex items-center justify-between bg-gray-800/50 rounded px-3 py-2">
                                        <p className="text-white font-mono">{profile.users.email}</p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(profile.users.email);
                                                alert('Email copied!');
                                            }}
                                            className="text-saffron hover:text-saffron-dark transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Password (Hashed)</p>
                                    <div className="bg-gray-800/50 rounded px-3 py-2">
                                        <p className="text-gray-500 font-mono text-xs break-all">{profile.users.password_hash}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        ⚠️ Password is bcrypt hashed and cannot be retrieved. User must reset if forgotten.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="Full Name" value={profile.full_name} />
                                <InfoField label="Gender" value={profile.gender} />
                                <InfoField label="Date of Birth" value={profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN') : null} />
                                <InfoField label="Birth Time" value={profile.birth_time} />
                                <InfoField label="Birth City" value={profile.birth_city} />
                                <InfoField label="Marital Status" value={profile.marital_status} />
                            </div>
                        </div>

                        {/* Physical Details */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Physical Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InfoField label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : null} />
                                <InfoField label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : null} />
                                <InfoField label="Blood Group" value={profile.blood_group} />
                            </div>
                        </div>

                        {/* Religious Information */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Religious Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="Religion" value={profile.religion} />
                                <InfoField label="Caste" value={profile.caste} />
                                <InfoField label="Sub Caste" value={profile.sub_caste} />
                                <InfoField label="Gotra" value={profile.gotra} />
                                <InfoField label="Manglik" value={profile.manglik} />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InfoField label="City" value={profile.city} />
                                <InfoField label="State" value={profile.state} />
                                <InfoField label="Country" value={profile.country} />
                            </div>
                        </div>

                        {/* Education & Career */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Education & Career</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="Education" value={profile.education} />
                                <InfoField label="Occupation" value={profile.occupation} />
                                <InfoField label="Annual Income" value={profile.annual_income} />
                                <InfoField label="Yearly Income" value={profile.yearly_income} />
                                <InfoField label="Company Name" value={profile.company_name} className="md:col-span-2" />
                            </div>
                        </div>

                        {/* Family Information */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Family Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="Father's Name" value={profile.father_name} />
                                <InfoField label="Mother's Name" value={profile.mother_name} />
                                <InfoField label="Father's Occupation" value={profile.father_occupation} />
                                <InfoField label="Mother's Occupation" value={profile.mother_occupation} />
                                <InfoField label="Siblings" value={profile.siblings} />
                                <InfoField label="Family Type" value={profile.family_type} />
                                <InfoField label="Family Status" value={profile.family_status} className="md:col-span-2" />
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                            <div className="space-y-4">
                                <InfoField label="About Me" value={profile.about_me} multiline />
                                <InfoField label="Hobbies" value={profile.hobbies} multiline />
                                <InfoField label="Expectations" value={profile.expectations} multiline />
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="Email" value={profile.users.email} />
                                <InfoField label="Phone" value={profile.users.phone} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <strong>{profile.full_name}</strong>'s profile? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for displaying info fields
const InfoField = ({ label, value, multiline = false, className = '' }) => {
    return (
        <div className={className}>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            {multiline ? (
                <p className="text-white whitespace-pre-wrap">{value || 'N/A'}</p>
            ) : (
                <p className="text-white font-medium">{value || 'N/A'}</p>
            )}
        </div>
    );
};

export default ProfileDetail;
