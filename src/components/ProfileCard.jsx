import { useNavigate } from 'react-router-dom';
import {
    User,
    Calendar,
    Ruler,
    MapPin,
    Briefcase,
    Eye,
    Heart
} from 'lucide-react';
import { calculateAge } from '../services/profileService';
import { sendInterest } from '../services/interestService';

const ProfileCard = ({ profile, onShowInterest, hasShownInterest }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        // Use user_id for navigation
        navigate(`/profile/${profile.user_id}`);
    };

    const handleInterest = async () => {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (!currentUser.id) {
            alert('Please login to send interest');
            navigate('/login');
            return;
        }

        // Send interest via service
        const { success, error } = await sendInterest(currentUser.id, profile.user_id);

        if (success) {
            // Call parent callback to update UI
            onShowInterest(profile.id);
        } else {
            alert(error || 'Failed to send interest');
        }
    };

    // Calculate age from date_of_birth
    const age = calculateAge(profile.date_of_birth);

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2">
            {/* Profile Image */}
            <div className="relative h-72 bg-gray-100 overflow-hidden">
                {profile.profile_photo_url ? (
                    <img
                        src={profile.profile_photo_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <User className="w-20 h-20 text-gray-300" />
                    </div>
                )}

                {/* Jain Sect Badge */}
                {profile.sub_caste && (
                    <div className="absolute top-4 right-4">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-saffron text-xs font-black rounded-full shadow-lg uppercase tracking-wider">
                            {profile.sub_caste}
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={handleViewDetails}
                        className="p-4 bg-white rounded-full text-saffron shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500"
                    >
                        <Eye className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-saffron transition-colors truncate">
                    {profile.full_name || 'N/A'}
                </h3>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-500 gap-3">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-saffron/10 group-hover:text-saffron transition-colors">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold">{age ? `${age} years` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-500 gap-3">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-saffron/10 group-hover:text-saffron transition-colors">
                            <Ruler className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold">{profile.height_cm ? `${profile.height_cm} cm` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-500 gap-3">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-saffron/10 group-hover:text-saffron transition-colors">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold truncate">{profile.city || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-500 gap-3">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-saffron/10 group-hover:text-saffron transition-colors">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold truncate">{profile.occupation || 'N/A'}</span>
                    </div>
                </div>

                {/* Primary Action */}
                <button
                    onClick={handleViewDetails}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-2xl font-bold text-sm tracking-wide hover:bg-saffron transition-colors flex items-center justify-center gap-2 group/btn"
                >
                    View Full Profile
                    <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
