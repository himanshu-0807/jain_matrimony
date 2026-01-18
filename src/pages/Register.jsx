import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitApplication, checkExistingApplication } from '../services/registrationService';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        biodataPdf: null,
        photos: [null, null, null, null, null]
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e, type, index = null) => {
        const file = e.target.files[0];

        if (type === 'pdf') {
            // Validate PDF
            if (file && file.type !== 'application/pdf') {
                setErrors({ ...errors, pdf: 'Please upload a PDF file' });
                return;
            }
            setFormData({ ...formData, biodataPdf: file });
            setErrors({ ...errors, pdf: '' });
        } else if (type === 'photo') {
            // Validate image
            if (file && !file.type.startsWith('image/')) {
                setErrors({ ...errors, [`photo${index}`]: 'Please upload an image file' });
                return;
            }
            const newPhotos = [...formData.photos];
            newPhotos[index] = file;
            setFormData({ ...formData, photos: newPhotos });
            setErrors({ ...errors, [`photo${index}`]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Validation
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.biodataPdf) {
            newErrors.pdf = 'Biodata PDF is required';
        }

        const uploadedPhotos = formData.photos.filter(photo => photo !== null);
        if (uploadedPhotos.length < 1) {
            newErrors.photos = 'Please upload at least 1 photo';
        } else if (uploadedPhotos.length > 5) {
            newErrors.photos = 'Maximum 5 photos allowed';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Check for existing application
            console.log('🔍 Checking for existing application...');
            const { exists, status } = await checkExistingApplication(formData.email, formData.phone);

            if (exists) {
                setErrors({
                    general: `An application with this email or phone already exists and is ${status}. Please use different credentials or contact support.`
                });
                setLoading(false);
                return;
            }

            // Submit application
            console.log('📤 Submitting application...');
            const { success, error } = await submitApplication({
                email: formData.email,
                phone: formData.phone,
                biodataPdf: formData.biodataPdf,
                photos: uploadedPhotos
            });

            if (error) {
                setErrors({ general: error });
                setLoading(false);
                return;
            }

            if (success) {
                console.log('✅ Application submitted successfully!');
                setShowSuccess(true);
                setLoading(false);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (err) {
            console.error('Submission error:', err);
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gold-light via-white to-jain-cream flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="card p-8 border-2 border-green-500 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Application Submitted Successfully!
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 mb-4">
                            Thank you for registering with Jain Matrimony.
                        </p>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                            <p className="text-sm md:text-base text-gray-700">
                                Your application is under review. Our team will verify your details within <strong>24 hours</strong>.
                            </p>
                        </div>
                        <p className="text-sm md:text-base text-gray-600">
                            You will receive your login credentials via <strong>Email</strong> and <strong>WhatsApp</strong> once approved.
                        </p>
                        <div className="mt-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gold-light via-white to-jain-cream py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        <span className="text-saffron">Jain</span>
                        <span className="text-gold-dark"> Matrimony</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">Register for a verified profile</p>
                </div>

                {/* Registration Card */}
                <div className="card p-6 md:p-8 border-2 border-saffron">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                        Registration Application
                    </h2>

                    {/* Important Notice */}
                    <div className="bg-gold-light border-l-4 border-saffron p-4 mb-6">
                        <div className="flex items-start">
                            <span className="text-2xl mr-3">ℹ️</span>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Important Information</h3>
                                <ul className="text-sm md:text-base text-gray-700 space-y-1">
                                    <li>• Your application will be reviewed within <strong>24 hours</strong></li>
                                    <li>• Login credentials will be sent via <strong>Email & WhatsApp</strong></li>
                                    <li>• All information must be accurate and verifiable</li>
                                    <li>• Upload clear, recent photos for better matches</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">
                                <span className="font-semibold">Error:</span> {errors.general}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                                placeholder="your.email@example.com"
                                disabled={loading}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="input-field"
                                placeholder="+91 98765 43210"
                                disabled={loading}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Biodata PDF Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Biodata PDF <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-saffron transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(e, 'pdf')}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    <div className="text-4xl md:text-5xl mb-2">📄</div>
                                    {formData.biodataPdf ? (
                                        <p className="text-sm md:text-base text-green-600 font-semibold">
                                            ✓ {formData.biodataPdf.name}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-sm md:text-base text-gray-600 mb-1">
                                                Click to upload your biodata PDF
                                            </p>
                                            <p className="text-xs md:text-sm text-gray-500">
                                                PDF format only, max 5MB
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                            {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf}</p>}
                        </div>

                        {/* Photo Uploads */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload 5 Photos <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs md:text-sm text-gray-500 mb-3">
                                Upload clear, recent photos (JPG, PNG format)
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div key={index} className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'photo', index)}
                                            className="hidden"
                                            id={`photo-${index}`}
                                        />
                                        <label
                                            htmlFor={`photo-${index}`}
                                            className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-saffron transition-colors cursor-pointer aspect-square flex flex-col items-center justify-center"
                                        >
                                            {formData.photos[index] ? (
                                                <>
                                                    <div className="text-3xl md:text-4xl mb-1">✓</div>
                                                    <p className="text-xs text-green-600 font-semibold">Photo {index + 1}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-3xl md:text-4xl mb-1">📷</div>
                                                    <p className="text-xs text-gray-600">Photo {index + 1}</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.photos && <p className="text-red-500 text-sm mt-2">{errors.photos}</p>}
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                                📋 Disclaimer & Terms
                            </h4>
                            <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                                <li>• All submitted information will be verified by our team</li>
                                <li>• False information may lead to rejection of application</li>
                                <li>• Your data will be kept confidential and secure</li>
                                <li>• Review process typically takes 12-24 hours</li>
                                <li>• You agree to our terms and conditions by submitting</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full btn-primary py-3 text-base md:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting Application...
                                </span>
                            ) : (
                                'Submit Application for Review'
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <p className="text-sm md:text-base text-gray-600">
                            Already have credentials?{' '}
                            <Link to="/" className="text-saffron hover:text-saffron-dark font-semibold">
                                Login Here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Om Symbol */}
                <div className="text-center mt-6">
                    <span className="text-4xl text-saffron opacity-50">ॐ</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
