import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getSentInterests, getReceivedInterests, acceptInterest, rejectInterest } from '../services/interestService';
import { calculateAge } from '../services/profileService';

const Interests = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('sent');
    const [sentInterests, setSentInterests] = useState([]);
    const [receivedInterests, setReceivedInterests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInterests();
    }, []);

    const loadInterests = async () => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (!currentUser.id) {
            navigate('/login');
            return;
        }

        // Load both sent and received interests
        const [sent, received] = await Promise.all([
            getSentInterests(currentUser.id),
            getReceivedInterests(currentUser.id)
        ]);

        if (!sent.error) {
            setSentInterests(sent.interests);
        }

        if (!received.error) {
            setReceivedInterests(received.interests);
        }

        setLoading(false);
    };

    const handleAccept = async (interestId) => {
        const { success } = await acceptInterest(interestId);

        if (success) {
            // Update local state
            setReceivedInterests(prev =>
                prev.map(interest =>
                    interest.id === interestId
                        ? { ...interest, status: 'accepted' }
                        : interest
                )
            );
        }
    };

    const handleReject = async (interestId) => {
        const { success } = await rejectInterest(interestId);

        if (success) {
            // Update local state
            setReceivedInterests(prev =>
                prev.map(interest =>
                    interest.id === interestId
                        ? { ...interest, status: 'rejected' }
                        : interest
                )
            );
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            accepted: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700'
        };

        const labels = {
            pending: 'Pending',
            accepted: 'Accepted',
            rejected: 'Rejected'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const renderSentInterestCard = (interest) => {
        const profile = interest.to_profile;
        if (!profile) return null;

        const age = calculateAge(profile.date_of_birth);

        return (
            <div key={interest.id} className="card p-4 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Profile Image */}
                    {profile.profile_photo_url ? (
                        <img
                            src={profile.profile_photo_url}
                            alt={profile.full_name}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}

                    {/* Profile Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{profile.full_name || 'N/A'}</h3>
                                <p className="text-sm text-gray-600">
                                    {age ? `${age} years` : 'N/A'} • {profile.height_cm ? `${profile.height_cm} cm` : 'N/A'} • {profile.city || 'N/A'}
                                </p>
                            </div>
                            {getStatusBadge(interest.status)}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            {profile.occupation || 'N/A'} • {profile.sub_caste || 'N/A'}
                        </p>

                        <p className="text-xs text-gray-500 mb-3">
                            Sent on: {new Date(interest.created_at).toLocaleDateString('en-IN')}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/profile/${profile.user_id}`)}
                                className="btn-secondary text-sm py-1.5 px-4"
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderReceivedInterestCard = (interest) => {
        const profile = interest.from_profile;
        if (!profile) return null;

        const age = calculateAge(profile.date_of_birth);

        return (
            <div key={interest.id} className="card p-4 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Profile Image */}
                    {profile.profile_photo_url ? (
                        <img
                            src={profile.profile_photo_url}
                            alt={profile.full_name}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}

                    {/* Profile Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{profile.full_name || 'N/A'}</h3>
                                <p className="text-sm text-gray-600">
                                    {age ? `${age} years` : 'N/A'} • {profile.height_cm ? `${profile.height_cm} cm` : 'N/A'} • {profile.city || 'N/A'}
                                </p>
                            </div>
                            {getStatusBadge(interest.status)}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            {profile.occupation || 'N/A'} • {profile.sub_caste || 'N/A'}
                        </p>

                        <p className="text-xs text-gray-500 mb-3">
                            Received on: {new Date(interest.created_at).toLocaleDateString('en-IN')}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/profile/${profile.user_id}`)}
                                className="btn-secondary text-sm py-1.5 px-4"
                            >
                                View Profile
                            </button>

                            {interest.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleAccept(interest.id)}
                                        className="bg-green-600 text-white text-sm py-1.5 px-4 rounded-lg hover:bg-green-700 font-medium"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(interest.id)}
                                        className="bg-red-600 text-white text-sm py-1.5 px-4 rounded-lg hover:bg-red-700 font-medium"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                    <p className="text-gray-600 mt-4">Loading interests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Interests</h1>
                    <p className="text-gray-600 mt-1">Manage your sent and received interests</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'sent'
                            ? 'text-saffron border-b-2 border-saffron'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Sent Interests ({sentInterests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'received'
                            ? 'text-saffron border-b-2 border-saffron'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Received Interests ({receivedInterests.length})
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {activeTab === 'sent' && (
                        <>
                            {sentInterests.length > 0 ? (
                                sentInterests.map(interest => renderSentInterestCard(interest))
                            ) : (
                                <div className="text-center py-16 card">
                                    <p className="text-gray-500 text-lg mb-4">No sent interests yet</p>
                                    <button
                                        onClick={() => navigate('/home')}
                                        className="btn-primary"
                                    >
                                        Browse Profiles
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'received' && (
                        <>
                            {receivedInterests.length > 0 ? (
                                receivedInterests.map(interest => renderReceivedInterestCard(interest))
                            ) : (
                                <div className="text-center py-16 card">
                                    <p className="text-gray-500 text-lg">No received interests yet</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Interests;
