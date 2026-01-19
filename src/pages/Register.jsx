import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitApplication, checkExistingApplication } from '../services/registrationService';
import TermsModal from '../components/TermsModal';
import PaymentModal from '../components/PaymentModal';
import {
    Step1Contact,
    Step2Basic,
    Step3Religious,
    Step4CareerFamily,
    Step5Personal
} from '../components/registration/RegisterFormSteps';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        full_name: '',
        gender: '',
        date_of_birth: '',
        birth_time: '',
        birth_city: '',
        marital_status: '',
        height_cm: '',
        weight_kg: '',
        blood_group: '',
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
        photos: [null, null, null, null, null]
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith('image/')) {
            setErrors({ ...errors, [`photo${index}`]: 'Please upload an image file' });
            return;
        }
        const newPhotos = [...formData.photos];
        newPhotos[index] = file;
        setFormData({ ...formData, photos: newPhotos });
        setErrors({ ...errors, [`photo${index}`]: '' });
    };

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.email) newErrors.email = 'Email is required';
            if (!formData.phone) newErrors.phone = 'Phone number is required';
            else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
                newErrors.phone = 'Please enter a valid 10-digit phone number';
            }
        } else if (step === 2) {
            if (!formData.full_name) newErrors.full_name = 'Full name is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
            if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
            if (!formData.marital_status) newErrors.marital_status = 'Marital status is required';
        } else if (step === 3) {
            if (!formData.city) newErrors.city = 'Current city is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation for photos on step 6
        const uploadedPhotos = formData.photos.filter(photo => photo !== null);
        if (uploadedPhotos.length < 1) {
            setErrors({ photos: 'Please upload at least 1 photo' });
            return;
        }

        setShowTermsModal(true);
    };

    const handleConfirmAgreement = () => {
        setShowTermsModal(false);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async (utrNumber) => {
        setLoading(true);
        setShowPaymentModal(false);

        try {
            // Extract profile data from formData
            const { email, phone, photos, ...profileData } = formData;

            // Check for existing application
            const { exists, status } = await checkExistingApplication(email, phone);

            if (exists) {
                setErrors({
                    general: `An application with this email or phone already exists and is ${status}.`
                });
                setLoading(false);
                return;
            }

            // Submit application
            const uploadedPhotos = photos.filter(photo => photo !== null);
            const { success, error } = await submitApplication({
                email,
                phone,
                photos: uploadedPhotos,
                utrNumber: utrNumber,
                profileData: profileData
            });

            if (error) {
                setErrors({ general: error });
                setLoading(false);
                return;
            }

            if (success) {
                setShowSuccess(true);
                setLoading(false);
            }
        } catch (err) {
            console.error('Submission error:', err);
            setErrors({ general: 'An unexpected error occurred.' });
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gold-light via-white to-jain-cream flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full animate-in zoom-in duration-500">
                    <div className="card p-8 md:p-12 border-2 border-green-500 text-center shadow-2xl rounded-[2.5rem] bg-white/90 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                        <div className="text-7xl mb-8 animate-bounce">✨</div>

                        {/* English Section */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-gray-800 mb-3">Registration Received!</h2>
                            <p className="text-lg text-gray-600 font-medium">
                                Thank you for providing your details. Our team is now reviewing your profile.
                            </p>
                        </div>

                        {/* Marathi Section */}
                        <div className="mb-10 pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">नोंदणी प्राप्त झाली आहे!</h2>
                            <p className="text-lg text-gray-600 font-medium">
                                आपली माहिती दिल्याबद्दल धन्यवाद. आमची टीम आता तुमच्या प्रोफाईलची पडताळणी करत आहे.
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-6 mb-8 text-left border border-green-100">
                            <div className="flex items-start gap-4 text-green-800">
                                <span className="text-2xl">ℹ️</span>
                                <div>
                                    <p className="text-sm font-bold mb-1">Important Information / महत्वाची माहिती:</p>
                                    <ul className="text-sm space-y-2 opacity-90">
                                        <li>• Verification typically takes 12-24 hours.</li>
                                        <li>• पडताळणीसाठी सहसा १२-२४ तास लागतात.</li>
                                        <li>• Credentials will be sent via WhatsApp/Email.</li>
                                        <li>• युजरनेम आणि पासवर्ड व्हॉट्सॲप/ईमेलद्वारे पाठवला जाईल.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/"
                                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-saffron to-gold-dark text-white rounded-2xl font-bold shadow-xl shadow-saffron/30 hover:scale-[1.05] active:scale-95 transition-all text-center"
                            >
                                Go to Login Page
                            </Link>
                            <Link
                                to="/"
                                className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all text-center"
                            >
                                लॉगिन पृष्ठावर जा
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gold-light via-white to-jain-cream py-8 px-4">
            <TermsModal
                isOpen={showTermsModal}
                onConfirm={handleConfirmAgreement}
                onCancel={() => setShowTermsModal(false)}
            />
            <PaymentModal
                isOpen={showPaymentModal}
                onConfirm={handleConfirmPayment}
                onCancel={() => setShowPaymentModal(false)}
                loading={loading}
            />
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-saffron italic">Jain</span>
                        <span className="text-gold-dark"> Matrimony</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <div key={num} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= num ? 'bg-saffron' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>
                    <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-widest">Step {step} of 6</p>
                </div>

                <div className="card p-6 md:p-10 border border-gold-light shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron via-gold to-saffron"></div>

                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in shake duration-500">
                            <span>❌</span> {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && <Step1Contact formData={formData} onChange={handleInputChange} errors={errors} />}
                        {step === 2 && <Step2Basic formData={formData} onChange={handleInputChange} errors={errors} />}
                        {step === 3 && <Step3Religious formData={formData} onChange={handleInputChange} errors={errors} />}
                        {step === 4 && <Step4CareerFamily formData={formData} onChange={handleInputChange} errors={errors} />}
                        {step === 5 && <Step5Personal formData={formData} onChange={handleInputChange} errors={errors} />}

                        {step === 6 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Step 6: Profile Photos</h3>
                                <p className="text-sm text-gray-500">Upload up to 5 clear, recent photos of yourself.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <div key={index} className="relative group">
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index)} className="hidden" id={`photo-${index}`} />
                                            <label htmlFor={`photo-${index}`} className="block aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-saffron hover:bg-saffron/5 transition-all group-hover:scale-95 overflow-hidden relative">
                                                {formData.photos[index] ? (
                                                    <>
                                                        <img src={URL.createObjectURL(formData.photos[index])} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs font-bold">Change</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-3xl mb-1">📸</div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Photo {index + 1}</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.photos && <p className="text-red-500 text-sm mt-2">{errors.photos}</p>}

                                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                                    <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                                        <span>📝</span> Final Review
                                    </h4>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        By clicking submit, you confirm that all information provided is accurate.
                                        Once submitted, your application will enter the verification queue.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-10 flex justify-between gap-4">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">
                                    Back
                                </button>
                            )}
                            {step < 6 ? (
                                <button type="button" onClick={nextStep} className="ml-auto px-10 py-4 bg-gradient-to-r from-saffron to-gold-dark text-white rounded-2xl font-bold shadow-lg shadow-saffron/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    Continue
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className="ml-auto px-10 py-4 bg-gradient-to-r from-saffron to-gold-dark text-white rounded-2xl font-bold shadow-xl shadow-saffron/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2">
                                    {loading ? 'Submitting...' : 'Complete Registration'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="text-center mt-8 space-y-4">
                    <p className="text-gray-500 text-sm">
                        Already have an account? <Link to="/" className="text-saffron font-bold hover:underline">Sign In</Link>
                    </p>
                    <div className="text-4xl text-saffron opacity-20 select-none">ॐ</div>
                </div>
            </div>
        </div>
    );
};

export default Register;
