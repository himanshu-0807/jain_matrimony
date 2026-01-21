import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Camera,
    Trash2,
    Image as ImageIcon,
    Plus,
    User,
    Star,
    Loader2,
    Calendar,
    Ruler,
    Heart,
    GraduationCap,
    Briefcase,
    Building2,
    IndianRupee,
    Info,
    MapPin,
    Users,
    Mail,
    Phone,
    CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getProfileById } from '../services/profileService';
import { supabase } from '../lib/supabase';
import { revokeAccess } from '../services/authService';

const MyProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        date_of_birth: '',
        gender: '',
        height_cm: '',
        weight_kg: '',
        blood_group: '',
        marital_status: '',
        education: '',
        occupation: '',
        company_name: '',
        annual_income: '',
        religion: 'Jain',
        caste: '',
        sub_caste: '',
        gotra: '',
        manglik: '',
        city: '',
        state: '',
        country: 'India',
        father_name: '',
        mother_name: '',
        siblings: '',
        family_type: '',
        about_me: '',
        hobbies: '',
        expectations: '',
        profile_photo_url: '',
        photo_urls: []
    });

    const [imagePreview, setImagePreview] = useState('');
    const [additionalPhotos, setAdditionalPhotos] = useState([]);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (!currentUser.id) {
            navigate('/login');
            return;
        }

        const { profile: data, error } = await getProfileById(currentUser.id);

        if (error) {
            console.error('Error loading profile:', error);
            setLoading(false);
            return;
        }

        if (!data) {
            setLoading(false);
            return;
        }

        // Profile exists - populate form
        setProfile(data);
        setFormData({
            full_name: data.full_name || '',
            date_of_birth: data.date_of_birth || '',
            gender: data.gender || '',
            height_cm: data.height_cm || '',
            weight_kg: data.weight_kg || '',
            blood_group: data.blood_group || '',
            marital_status: data.marital_status || '',
            education: data.education || '',
            occupation: data.occupation || '',
            company_name: data.company_name || '',
            annual_income: data.annual_income || '',
            religion: data.religion || 'Jain',
            caste: data.caste || '',
            sub_caste: data.sub_caste || '',
            gotra: data.gotra || '',
            manglik: data.manglik || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || 'India',
            father_name: data.father_name || '',
            mother_name: data.mother_name || '',
            siblings: data.siblings || '',
            family_type: data.family_type || '',
            about_me: data.about_me || '',
            hobbies: data.hobbies || '',
            expectations: data.expectations || '',
            profile_photo_url: data.profile_photo_url || '',
            photo_urls: data.photo_urls || []
        });
        setImagePreview(data.profile_photo_url || '');
        setAdditionalPhotos(data.photo_urls || []);

        setLoading(false);
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, profile_photo_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalPhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (additionalPhotos.length >= 5) {
                alert('Maximum 5 gallery photos allowed');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhotos = [...additionalPhotos, reader.result];
                setAdditionalPhotos(newPhotos);
                setFormData({ ...formData, photo_urls: newPhotos });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePhoto = (index) => {
        const newPhotos = additionalPhotos.filter((_, i) => i !== index);
        setAdditionalPhotos(newPhotos);
        setFormData({ ...formData, photo_urls: newPhotos });
    };

    const handleSetMainPhoto = (index) => {
        const selectedPhoto = additionalPhotos[index];
        const oldMainPhoto = imagePreview;

        // Create new gallery by removing selected photo and adding old main (if it exists)
        let newGallery = additionalPhotos.filter((_, i) => i !== index);
        if (oldMainPhoto) {
            newGallery = [...newGallery, oldMainPhoto];
        }

        setImagePreview(selectedPhoto);
        setAdditionalPhotos(newGallery);
        setFormData({
            ...formData,
            profile_photo_url: selectedPhoto,
            photo_urls: newGallery
        });
    };

    const handleDeleteMainPhoto = () => {
        setImagePreview('');
        setFormData({ ...formData, profile_photo_url: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imagePreview && additionalPhotos.length === 0) {
            alert('Please upload at least one photo');
            return;
        }

        setSaving(true);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        try {
            const profileData = {
                ...formData,
                user_id: currentUser.id
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'user_id' });

            if (error) {
                alert('Error saving profile: ' + error.message);
            } else {
                alert('Profile saved successfully!');
                navigate('/home');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleRevokeAccess = async () => {
        if (!window.confirm('Are you sure you want to revoke your application? This will permanently delete your profile and account. This action cannot be undone.')) {
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (!currentUser.id) return;

        setSaving(true);
        try {
            const { success, error } = await revokeAccess(currentUser.id);

            if (success) {
                alert('Your application has been revoked and account deleted.');
                localStorage.clear();
                navigate('/login');
            } else {
                alert('Failed to revoke application: ' + error);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                    <Loader2 className="w-12 h-12 text-saffron animate-spin mx-auto" />
                    <p className="text-gray-500 font-bold mt-6 text-lg tracking-tight">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">My Profile</h1>
                    <p className="text-gray-500 font-medium text-lg">
                        {profile ? 'Personalize your identity and find your ideal partner' : 'Create your professional bio data to start your journey'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Photos Management Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron">
                                    <Camera className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Manage Photos</h2>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Total: {additionalPhotos.length + (imagePreview ? 1 : 0)}/6 images</p>
                                </div>
                            </div>

                            <label className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${(additionalPhotos.length + (imagePreview ? 1 : 0)) >= 6
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 text-white hover:bg-saffron hover:shadow-saffron/30'
                                }`}>
                                <Plus className="w-4 h-4" />
                                Add Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(additionalPhotos.length + (imagePreview ? 1 : 0)) >= 6 ? undefined : (imagePreview ? handleAdditionalPhotoUpload : handleImageUpload)}
                                    className="hidden"
                                    disabled={(additionalPhotos.length + (imagePreview ? 1 : 0)) >= 6}
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {/* Main Photo Slot */}
                            <div className={`relative group aspect-[3/4] rounded-3xl overflow-hidden border-2 transition-all ${imagePreview ? 'border-saffron shadow-xl' : 'border-dashed border-gray-200 bg-gray-50'
                                }`}>
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Main Profile" />
                                        <div className="absolute top-3 left-3 bg-saffron text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                                            <Star className="w-2.5 h-2.5 fill-white" />
                                            Main
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={handleDeleteMainPhoto}
                                                className="w-12 h-12 bg-white/20 hover:bg-red-500 text-white rounded-2xl backdrop-blur-md transition-all flex items-center justify-center"
                                                title="Delete main photo"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group/label">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 group-hover/label:scale-110 transition-transform">
                                            <Camera className="w-6 h-6 text-gray-300 group-hover/label:text-saffron transition-colors" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center px-4">Upload Main Photo</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>

                            {/* Gallery Photos */}
                            {additionalPhotos.map((photo, index) => (
                                <div key={index} className="relative group aspect-[3/4] rounded-3xl overflow-hidden border-2 border-transparent bg-gray-50 transition-all hover:shadow-xl hover:border-saffron/30">
                                    <img src={photo} className="w-full h-full object-cover" alt={`Gallery ${index}`} />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleSetMainPhoto(index)}
                                            className="w-10 h-10 bg-white text-gray-900 rounded-xl hover:bg-saffron hover:text-white transition-all flex items-center justify-center shadow-lg"
                                            title="Set as main photo"
                                        >
                                            <Star className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePhoto(index)}
                                            className="w-10 h-10 bg-white/20 text-white rounded-xl hover:bg-red-500 transition-all flex items-center justify-center backdrop-blur-md"
                                            title="Delete photo"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Empty Slots */}
                            {Array.from({ length: Math.max(0, 5 - additionalPhotos.length - (imagePreview ? 0 : 1)) }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-gray-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => handleChange('full_name', e.target.value)}
                                    className="input-field"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Height (cm) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.height_cm}
                                    onChange={(e) => handleChange('height_cm', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., 170"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    value={formData.weight_kg}
                                    onChange={(e) => handleChange('weight_kg', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., 65"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marital Status *
                                </label>
                                <select
                                    value={formData.marital_status}
                                    onChange={(e) => handleChange('marital_status', e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Never Married">Never Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Professional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Education *
                                </label>
                                <input
                                    type="text"
                                    value={formData.education}
                                    onChange={(e) => handleChange('education', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., B.Tech in Computer Science"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Occupation *
                                </label>
                                <input
                                    type="text"
                                    value={formData.occupation}
                                    onChange={(e) => handleChange('occupation', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Software Engineer"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => handleChange('company_name', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Google"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Annual Income
                                </label>
                                <input
                                    type="text"
                                    value={formData.annual_income}
                                    onChange={(e) => handleChange('annual_income', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., 10-15 LPA"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Religious Information */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Religious Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Caste
                                </label>
                                <input
                                    type="text"
                                    value={formData.caste}
                                    onChange={(e) => handleChange('caste', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Digambar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sub Caste
                                </label>
                                <input
                                    type="text"
                                    value={formData.sub_caste}
                                    onChange={(e) => handleChange('sub_caste', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Agarwal"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gotra
                                </label>
                                <input
                                    type="text"
                                    value={formData.gotra}
                                    onChange={(e) => handleChange('gotra', e.target.value)}
                                    className="input-field"
                                    placeholder="Enter gotra"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manglik
                                </label>
                                <select
                                    value={formData.manglik}
                                    onChange={(e) => handleChange('manglik', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Don't Know">Don't Know</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Mumbai"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => handleChange('state', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Maharashtra"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., India"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Family Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Family Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Father's Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.father_name}
                                    onChange={(e) => handleChange('father_name', e.target.value)}
                                    className="input-field"
                                    placeholder="Enter father's name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.mother_name}
                                    onChange={(e) => handleChange('mother_name', e.target.value)}
                                    className="input-field"
                                    placeholder="Enter mother's name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Siblings
                                </label>
                                <input
                                    type="text"
                                    value={formData.siblings}
                                    onChange={(e) => handleChange('siblings', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., 1 brother, 1 sister"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Family Type
                                </label>
                                <select
                                    value={formData.family_type}
                                    onChange={(e) => handleChange('family_type', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Select</option>
                                    <option value="Nuclear">Nuclear</option>
                                    <option value="Joint">Joint</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* About Me */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            About Me
                        </label>
                        <textarea
                            value={formData.about_me}
                            onChange={(e) => handleChange('about_me', e.target.value)}
                            className="input-field"
                            rows="4"
                            placeholder="Write a brief description about yourself..."
                        />
                    </div>

                    {/* Hobbies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hobbies & Interests
                        </label>
                        <textarea
                            value={formData.hobbies}
                            onChange={(e) => handleChange('hobbies', e.target.value)}
                            className="input-field"
                            rows="3"
                            placeholder="e.g., Reading, Traveling, Music..."
                        />
                    </div>

                    {/* Expectations */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Partner Expectations
                        </label>
                        <textarea
                            value={formData.expectations}
                            onChange={(e) => handleChange('expectations', e.target.value)}
                            className="input-field"
                            rows="4"
                            placeholder="Describe what you're looking for in a partner..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 btn-primary py-3"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="flex-1 btn-secondary py-3"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Revoke Access Section */}
                    <div className="border-t border-red-200 pt-8 mt-12">
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8">
                            <h3 className="text-xl font-bold text-red-800 mb-2 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Danger Zone
                            </h3>
                            <p className="text-red-600 mb-6">
                                If you wish to withdraw your application and remove all your data from our system, you can revoke your application here.
                                <br /><strong>Warning: This action is irreversible.</strong>
                            </p>
                            <button
                                type="button"
                                onClick={handleRevokeAccess}
                                disabled={saving}
                                className="px-6 py-3 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                            >
                                {saving ? 'Processing...' : '⚠️ Revoke My Application'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyProfile;
