import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getApplicationById, approveApplication, rejectApplication, generatePassword } from '../../services/adminService';

const ReviewApplication = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showCredentials, setShowCredentials] = useState(false);
    const [credentials, setCredentials] = useState(null);

    // Editable email and phone (in case they're invalid)
    const [editableEmail, setEditableEmail] = useState('');
    const [editablePhone, setEditablePhone] = useState('');

    // Profile form data
    const [profileData, setProfileData] = useState({
        full_name: '',
        gender: '',
        date_of_birth: '',
        birth_time: '',
        birth_city: '',
        height_cm: '',
        weight_kg: '',
        blood_group: '',
        marital_status: '',
        religion: 'Jain',
        caste: '',
        sub_caste: '',
        gotra: '',
        manglik: '',
        city: '',
        state: '',
        country: 'India',
        education: '',
        occupation: '',
        annual_income: '',
        yearly_income: '',
        company_name: '',
        father_name: '',
        mother_name: '',
        father_occupation: '',
        mother_occupation: '',
        siblings: 0,
        family_type: '',
        family_status: '',
        about_me: '',
        hobbies: '',
        expectations: '',
        contact_details: {}
    });

    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        loadApplication();
    }, [id]);

    const loadApplication = async () => {
        const { application: data, error } = await getApplicationById(id);
        if (!error && data) {
            setApplication(data);
            setEditableEmail(data.email);
            setEditablePhone(data.phone);

            // Pre-fill profile form with data from application if available
            setProfileData(prev => ({
                ...prev,
                ...(data.profile_data || {}),
                contact_details: {
                    email: data.email,
                    phone: data.phone
                }
            }));
        }
        setLoading(false);
    };

    const handleGeneratePassword = () => {
        const pwd = generatePassword(profileData.full_name);
        setGeneratedPassword(pwd);
    };

    const handleApprove = async () => {
        if (!generatedPassword) {
            alert('Please generate a password first');
            return;
        }

        if (!profileData.full_name || !profileData.gender || !profileData.date_of_birth) {
            alert('Please fill in at least Name, Gender, and Date of Birth');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editableEmail)) {
            alert('Please enter a valid email address');
            return;
        }

        setProcessing(true);

        // Create a modified application object with editable email/phone
        const modifiedApplication = {
            ...application,
            email: editableEmail,
            phone: editablePhone
        };

        const { success, credentials: creds, error } = await approveApplication(
            id,
            profileData,
            generatedPassword,
            modifiedApplication  // Pass modified application
        );

        if (error) {
            alert(`Approval failed: ${error}`);
            setProcessing(false);
            return;
        }

        if (success && creds) {
            setCredentials(creds);
            setShowCredentials(true);
        }

        setProcessing(false);
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        setProcessing(true);

        const { success, error } = await rejectApplication(id, rejectionReason);

        if (error) {
            alert(`Rejection failed: ${error}`);
            setProcessing(false);
            return;
        }

        if (success) {
            alert('Application rejected successfully');
            navigate('/admin/applications/pending');
        }

        setProcessing(false);
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron mb-4"></div>
                    <p className="text-gray-400">Loading application...</p>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-lg">Application not found</p>
                    <Link to="/admin/dashboard" className="text-saffron hover:underline mt-4 inline-block">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Credentials Modal
    if (showCredentials && credentials) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-8 border border-green-600">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-3xl font-bold text-white mb-2">Application Approved!</h2>
                        <p className="text-gray-400">User account created successfully</p>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-white mb-4">User Credentials</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-gray-400 text-sm">Email</p>
                                <p className="text-white font-mono text-lg">{credentials.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Phone</p>
                                <p className="text-white font-mono text-lg">{credentials.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Password</p>
                                <p className="text-green-400 font-mono text-lg font-bold">{credentials.password}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
                        <p className="text-yellow-200 text-sm">
                            ⚠️ <strong>Important:</strong> Copy these credentials and send them to the user via Email or WhatsApp.
                            This password will not be shown again.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
                                alert('Credentials copied to clipboard!');
                            }}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Copy Credentials
                        </button>
                        <Link
                            to="/admin/applications/pending"
                            className="flex-1 px-6 py-3 bg-saffron hover:bg-saffron-dark text-white rounded-lg transition-colors text-center"
                        >
                            Back to Applications
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 pb-12">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link to="/admin/applications/pending" className="text-gray-400 hover:text-white text-sm mb-1 block">
                                ← Back to Applications
                            </Link>
                            <h1 className="text-2xl font-bold text-white">Review Application</h1>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${application.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                            application.status === 'approved' ? 'bg-green-600 text-green-100' :
                                'bg-red-600 text-red-100'
                            }`}>
                            {application.status.toUpperCase()}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Documents */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Biodata PDF */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-4">Biodata PDF</h3>
                            {application.biodata_pdf_url ? (
                                <a
                                    href={application.biodata_pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
                                >
                                    📄 Open PDF in New Tab
                                </a>
                            ) : (
                                <p className="text-gray-400">No biodata uploaded</p>
                            )}
                        </div>

                        {/* Photos */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-4">Photos ({application.photo_urls?.length || 0}/5)</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {application.photo_urls?.map((url, index) => (
                                    <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="aspect-square rounded-lg overflow-hidden border-2 border-gray-700 hover:border-saffron transition-colors"
                                    >
                                        <img
                                            src={url}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info - Editable */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Email (Editable)</p>
                                    <input
                                        type="email"
                                        value={editableEmail}
                                        onChange={(e) => setEditableEmail(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                                        disabled={application.status !== 'pending'}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Original: {application.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Phone (Editable)</p>
                                    <input
                                        type="tel"
                                        value={editablePhone}
                                        onChange={(e) => setEditablePhone(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                                        disabled={application.status !== 'pending'}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Original: {application.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Submitted</p>
                                    <p className="text-white">{new Date(application.created_at).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-6">Profile Data Entry</h3>

                            {application.status !== 'pending' && (
                                <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                                    <p className="text-blue-200">
                                        This application has already been {application.status}. Form is read-only.
                                    </p>
                                </div>
                            )}

                            <form className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        Basic Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.full_name}
                                                onChange={(e) => handleInputChange('full_name', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Gender <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={profileData.gender}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Date of Birth <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={profileData.date_of_birth}
                                                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Birth Time
                                            </label>
                                            <input
                                                type="time"
                                                value={profileData.birth_time}
                                                onChange={(e) => handleInputChange('birth_time', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Birth City
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.birth_city}
                                                onChange={(e) => handleInputChange('birth_city', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., Mumbai"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Marital Status
                                            </label>
                                            <select
                                                value={profileData.marital_status}
                                                onChange={(e) => handleInputChange('marital_status', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Never Married">Never Married</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Details */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        Physical Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Height (cm)
                                            </label>
                                            <input
                                                type="number"
                                                value={profileData.height_cm}
                                                onChange={(e) => handleInputChange('height_cm', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., 170"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                value={profileData.weight_kg}
                                                onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., 65"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Blood Group
                                            </label>
                                            <select
                                                value={profileData.blood_group}
                                                onChange={(e) => handleInputChange('blood_group', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            >
                                                <option value="">Select</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Religious Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        Religious Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Caste
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.caste}
                                                onChange={(e) => handleInputChange('caste', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., Digambar"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Sub Caste
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.sub_caste}
                                                onChange={(e) => handleInputChange('sub_caste', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Gotra
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.gotra}
                                                onChange={(e) => handleInputChange('gotra', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Manglik
                                            </label>
                                            <select
                                                value={profileData.manglik}
                                                onChange={(e) => handleInputChange('manglik', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            >
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                                <option value="Anshik">Anshik</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        Location
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., Mumbai"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., Maharashtra"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.country}
                                                onChange={(e) => handleInputChange('country', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Education & Career - Continued in next part due to length */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        Education & Career
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Education
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.education}
                                                onChange={(e) => handleInputChange('education', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., B.Tech Computer Science"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Occupation
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.occupation}
                                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., Software Engineer"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Annual Income (Text)
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.annual_income}
                                                onChange={(e) => handleInputChange('annual_income', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., 10-15 Lakhs"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Yearly Income (Number)
                                            </label>
                                            <input
                                                type="number"
                                                value={profileData.yearly_income}
                                                onChange={(e) => handleInputChange('yearly_income', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., 1200000"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.company_name}
                                                onChange={(e) => handleInputChange('company_name', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                placeholder="e.g., TCS, Infosys"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Family Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        Family Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Father's Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.father_name}
                                                onChange={(e) => handleInputChange('father_name', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Father's Occupation
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.father_occupation}
                                                onChange={(e) => handleInputChange('father_occupation', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Mother's Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.mother_name}
                                                onChange={(e) => handleInputChange('mother_name', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Mother's Occupation
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.mother_occupation}
                                                onChange={(e) => handleInputChange('mother_occupation', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Number of Siblings
                                            </label>
                                            <input
                                                type="number"
                                                value={profileData.siblings}
                                                onChange={(e) => handleInputChange('siblings', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                min="0"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Family Type
                                            </label>
                                            <select
                                                value={profileData.family_type}
                                                onChange={(e) => handleInputChange('family_type', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            >
                                                <option value="">Select</option>
                                                <option value="Nuclear">Nuclear</option>
                                                <option value="Joint">Joint</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Family Status
                                            </label>
                                            <select
                                                value={profileData.family_status}
                                                onChange={(e) => handleInputChange('family_status', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                disabled={application.status !== 'pending'}
                                            >
                                                <option value="">Select</option>
                                                <option value="Middle Class">Middle Class</option>
                                                <option value="Upper Middle Class">Upper Middle Class</option>
                                                <option value="Rich">Rich</option>
                                                <option value="Affluent">Affluent</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        Personal Information
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                About Me
                                            </label>
                                            <textarea
                                                value={profileData.about_me}
                                                onChange={(e) => handleInputChange('about_me', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                rows="3"
                                                placeholder="Brief description about yourself..."
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Hobbies
                                            </label>
                                            <textarea
                                                value={profileData.hobbies}
                                                onChange={(e) => handleInputChange('hobbies', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                rows="2"
                                                placeholder="e.g., Reading, Traveling, Music"
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Partner Expectations
                                            </label>
                                            <textarea
                                                value={profileData.expectations}
                                                onChange={(e) => handleInputChange('expectations', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-saffron"
                                                rows="3"
                                                placeholder="What are you looking for in a partner..."
                                                disabled={application.status !== 'pending'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password Generation & Actions */}
                                {application.status === 'pending' && (
                                    <div className="border-t border-gray-700 pt-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">
                                            Generate Login Credentials
                                        </h4>
                                        <div className="flex gap-4 mb-6">
                                            <button
                                                type="button"
                                                onClick={handleGeneratePassword}
                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                            >
                                                🔑 Generate Password
                                            </button>
                                            {generatedPassword && (
                                                <div className="flex-1 px-4 py-3 bg-green-900/30 border border-green-700 rounded-lg flex items-center justify-between">
                                                    <span className="text-green-400 font-mono font-bold">{generatedPassword}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(generatedPassword);
                                                            alert('Password copied!');
                                                        }}
                                                        className="text-green-400 hover:text-green-300"
                                                    >
                                                        📋 Copy
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={handleApprove}
                                                disabled={processing || !generatedPassword}
                                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? 'Processing...' : '✅ Approve Application'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowRejectModal(true)}
                                                disabled={processing}
                                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                ❌ Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-red-600">
                        <h3 className="text-xl font-bold text-white mb-4">Reject Application</h3>
                        <p className="text-gray-400 mb-4">Please provide a reason for rejection:</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                            rows="4"
                            placeholder="Enter rejection reason..."
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={processing}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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

export default ReviewApplication;
