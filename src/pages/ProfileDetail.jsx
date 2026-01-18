import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    MapPin,
    Briefcase,
    GraduationCap,
    User,
    Calendar,
    Ruler,
    Scale,
    Droplets,
    Heart,
    Building2,
    IndianRupee,
    Users,
    Mail,
    Phone,
    BookOpen,
    Info,
    Palette,
    Target,
    Download,
    Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from '../components/Navbar';
import { getProfileById, calculateAge } from '../services/profileService';
import { sendInterest, hasInterestSent } from '../services/interestService';

const ProfileDetail = () => {
    const { id } = useParams(); // This is user_id
    const navigate = useNavigate();
    const pdfRef = useRef();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasShownInterest, setHasShownInterest] = useState(false);
    const [sendingInterest, setSendingInterest] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        const { profile: data, error } = await getProfileById(id);

        if (!error && data) {
            setProfile(data);

            // Check if interest already sent (from backend)
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.id) {
                const { hasSent } = await hasInterestSent(currentUser.id, id);
                setHasShownInterest(hasSent);
            }
        }
        setLoading(false);
    };

    const handleShowInterest = async () => {
        if (!profile || sendingInterest) return;

        setSendingInterest(true);

        // Get current user ID
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (!currentUser.id) {
            alert('Please login to send interest');
            navigate('/login');
            return;
        }

        // Send interest to backend
        const { success, error } = await sendInterest(currentUser.id, id);

        if (success) {
            setHasShownInterest(true);
            alert('Interest sent successfully!');
        } else {
            alert(error || 'Failed to send interest');
        }

        setSendingInterest(false);
    };

    const handleDownloadPDF = async () => {
        if (isDownloading) return;
        setIsDownloading(true);

        try {
            const element = pdfRef.current;
            // Temporarily show the element for capturing
            element.style.display = 'block';

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${profile.full_name}_BioData.pdf`);

            element.style.display = 'none';
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 text-sans">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                    <p className="text-gray-600 mt-4">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <p className="text-gray-500 text-lg">Profile not found</p>
                    <button onClick={() => navigate('/home')} className="mt-4 btn-primary">
                        Back to Browse
                    </button>
                </div>
            </div>
        );
    }

    const age = calculateAge(profile.date_of_birth);

    // Combine profile_photo_url and photo_urls into one array and remove duplicates
    const allPhotos = [
        ...new Set([
            profile.profile_photo_url,
            ...(profile.photo_urls || [])
        ])
    ].filter(Boolean);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center text-gray-500 hover:text-saffron font-bold transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Browse
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-saffron transition-all shadow-xl hover:shadow-saffron/30 active:scale-95 disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        {isDownloading ? 'Preparing PDF...' : 'Download Bio Data'}
                    </button>
                </div>

                <div className="card shadow-2xl overflow-hidden border-none rounded-3xl">
                    {/* Profile Header & Carousel */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white relative overflow-hidden">
                        {/* Decorative Background Element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-saffron/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                            {/* Carousel Container */}
                            <div className="w-full md:w-80 shrink-0">
                                <div className="relative group">
                                    {allPhotos.length > 0 ? (
                                        <>
                                            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 shadow-2xl relative border border-white/10">
                                                <img
                                                    src={allPhotos[currentImageIndex]}
                                                    alt={`${profile.full_name} - ${currentImageIndex + 1}`}
                                                    className="w-full h-full object-cover transition-opacity duration-300"
                                                />

                                                {/* Navigation Arrows */}
                                                {allPhotos.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={prevImage}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <ChevronLeft className="w-6 h-6" />
                                                        </button>
                                                        <button
                                                            onClick={nextImage}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <ChevronRight className="w-6 h-6" />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Badge */}
                                                {profile.sub_caste && (
                                                    <div className="absolute top-4 right-4">
                                                        <span className="px-4 py-1.5 bg-saffron text-white rounded-full font-bold text-xs shadow-lg uppercase tracking-wider">
                                                            {profile.sub_caste}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Thumbnails */}
                                            {allPhotos.length > 1 && (
                                                <div className="flex gap-3 mt-5 overflow-x-auto pb-2 scrollbar-hide justify-center md:justify-start">
                                                    {allPhotos.map((photo, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-saffron scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                                                                }`}
                                                        >
                                                            <img src={photo} className="w-full h-full object-cover" alt="" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="aspect-[4/5] rounded-2xl bg-white/5 flex items-center justify-center border-2 border-dashed border-white/20">
                                            <User className="w-20 h-20 text-white/20" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Header Text Info */}
                            <div className="text-center md:text-left flex-1 space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                                        {profile.full_name || 'N/A'}
                                    </h1>
                                    <p className="text-xl md:text-2xl font-medium text-gold flex items-center justify-center md:justify-start gap-2">
                                        <MapPin className="w-6 h-6" />
                                        {profile.city || 'N/A'}, {profile.state || 'N/A'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/10 flex flex-col items-center md:items-start">
                                        <Calendar className="w-5 h-5 text-saffron mb-2" />
                                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Age</span>
                                        <span className="text-lg font-bold">{age ? `${age} yrs` : 'N/A'}</span>
                                    </div>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/10 flex flex-col items-center md:items-start">
                                        <Ruler className="w-5 h-5 text-saffron mb-2" />
                                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Height</span>
                                        <span className="text-lg font-bold">{profile.height_cm ? `${profile.height_cm} cm` : 'N/A'}</span>
                                    </div>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/10 flex flex-col items-center md:items-start">
                                        <Heart className="w-5 h-5 text-saffron mb-2" />
                                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Status</span>
                                        <span className="text-lg font-bold truncate w-full text-center md:text-left">{profile.marital_status || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                                    {profile.occupation && (
                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-bold backdrop-blur-sm">
                                            <Briefcase className="w-4 h-4 text-gold" />
                                            {profile.occupation}
                                        </div>
                                    )}
                                    {profile.education && (
                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-bold backdrop-blur-sm">
                                            <GraduationCap className="w-4 h-4 text-gold" />
                                            {profile.education}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Container */}
                    <div className="p-8 md:p-12 space-y-16 bg-white">
                        {/* Personal Information */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-jain-cream rounded-xl">
                                    <User className="w-6 h-6 text-saffron" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date of Birth" value={profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN') : 'N/A'} />
                                <InfoItem icon={<User className="w-5 h-5" />} label="Gender" value={profile.gender || 'N/A'} />
                                <InfoItem icon={<Ruler className="w-5 h-5" />} label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : 'N/A'} />
                                <InfoItem icon={<Scale className="w-5 h-5" />} label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : 'N/A'} />
                                <InfoItem icon={<Droplets className="w-5 h-5" />} label="Blood Group" value={profile.blood_group || 'N/A'} />
                                <InfoItem icon={<Heart className="w-5 h-5" />} label="Marital Status" value={profile.marital_status || 'N/A'} />
                            </div>
                        </section>

                        {/* Professional Information */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-jain-cream rounded-xl">
                                    <Briefcase className="w-6 h-6 text-saffron" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Professional Life</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <InfoItem icon={<GraduationCap className="w-5 h-5" />} label="Education" value={profile.education || 'N/A'} />
                                <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Occupation" value={profile.occupation || 'N/A'} />
                                <InfoItem icon={<Building2 className="w-5 h-5" />} label="Company" value={profile.company_name || 'N/A'} />
                                <InfoItem icon={<IndianRupee className="w-5 h-5" />} label="Annual Income" value={profile.annual_income || 'N/A'} />
                            </div>
                        </section>

                        {/* Religious Information */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-jain-cream rounded-xl">
                                    <BookOpen className="w-6 h-6 text-saffron" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Religious Background</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <InfoItem icon={<Info className="w-5 h-5" />} label="Religion" value={profile.religion || 'N/A'} />
                                <InfoItem icon={<Info className="w-5 h-5" />} label="Caste" value={profile.caste || 'N/A'} />
                                <InfoItem icon={<Info className="w-5 h-5" />} label="Sub Caste / Sect" value={profile.sub_caste || 'N/A'} />
                                <InfoItem icon={<Info className="w-5 h-5" />} label="Gotra" value={profile.gotra || 'N/A'} />
                                <InfoItem icon={<Info className="w-5 h-5" />} label="Manglik" value={profile.manglik || 'N/A'} />
                            </div>
                        </section>

                        {/* Family Details */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-jain-cream rounded-xl">
                                    <Users className="w-6 h-6 text-saffron" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Family Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <InfoItem icon={<User className="w-5 h-5" />} label="Father's Name" value={profile.father_name || 'N/A'} />
                                <InfoItem icon={<User className="w-5 h-5" />} label="Mother's Name" value={profile.mother_name || 'N/A'} />
                                <InfoItem icon={<Users className="w-5 h-5" />} label="Siblings" value={profile.siblings || 'N/A'} />
                                <InfoItem icon={<Users className="w-5 h-5" />} label="Family Type" value={profile.family_type || 'N/A'} />
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Mail className="w-6 h-6 text-saffron" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Contact Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-saffron" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="text-lg font-bold text-gray-800">{profile.users?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-saffron" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                        <p className="text-lg font-bold text-gray-800">{profile.users?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* About Sections */}
                        <div className="space-y-12">
                            {profile.about_me && (
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Info className="w-6 h-6 text-saffron" />
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">About Me</h2>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed bg-jain-cream/30 p-8 rounded-3xl border border-gold/10 italic">
                                        "{profile.about_me}"
                                    </p>
                                </section>
                            )}

                            {profile.hobbies && (
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Palette className="w-6 h-6 text-saffron" />
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hobbies & Interests</h2>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed">{profile.hobbies}</p>
                                </section>
                            )}

                            {profile.expectations && (
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Target className="w-6 h-6 text-saffron" />
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Partner Expectations</h2>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                        {profile.expectations}
                                    </p>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden PDF Template */}
            <div
                ref={pdfRef}
                style={{
                    display: 'none',
                    width: '800px',
                    padding: '40px',
                    backgroundColor: '#ffffff',
                    position: 'relative'
                }}
            >
                {/* PDF Watermark */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-45deg)',
                        fontSize: '80px',
                        fontWeight: 'black',
                        color: 'rgba(212, 163, 115, 0.1)',
                        pointerEvents: 'none',
                        zIndex: 0,
                        whiteSpace: 'nowrap'
                    }}
                >
                    jainmatri.com
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px solid #F0A500', paddingBottom: '20px', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#111827', margin: 0 }}>{profile.full_name}</h1>
                            <p style={{ fontSize: '20px', color: '#F0A500', fontWeight: 'bold', margin: '5px 0' }}>
                                {profile.occupation} • {profile.city}, {profile.state}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                <span style={{ color: '#111827' }}>Jain</span>
                                <span style={{ color: '#F0A500' }}>Matri</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Biodata generated on {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '30px' }}>
                        {/* Photos Section */}
                        <div style={{ width: '250px', flexShrink: 0 }}>
                            {allPhotos.slice(0, 3).map((photo, i) => (
                                <div key={i} style={{ marginBottom: '15px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                    <img src={photo} style={{ width: '100%', display: 'block' }} alt="" crossOrigin="anonymous" />
                                </div>
                            ))}
                        </div>

                        {/* Data Section */}
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', borderBottom: '2px solid #F3F4F6', paddingBottom: '8px', marginBottom: '15px' }}>Personal Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <PDFItem label="Age" value={age ? `${age} years` : 'N/A'} />
                                    <PDFItem label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : (profile.height || 'N/A')} />
                                    <PDFItem label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : 'N/A'} />
                                    <PDFItem label="Blood Group" value={profile.blood_group || 'N/A'} />
                                    <PDFItem label="Marital Status" value={profile.marital_status || 'N/A'} />
                                    <PDFItem label="Gender" value={profile.gender || 'N/A'} />
                                    <PDFItem label="City" value={profile.city || 'N/A'} />
                                    <PDFItem label="State" value={profile.state || 'N/A'} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', borderBottom: '2px solid #F3F4F6', paddingBottom: '8px', marginBottom: '15px' }}>Education & Career</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <PDFItem label="Education" value={profile.education || 'N/A'} />
                                    <PDFItem label="Occupation" value={profile.occupation || 'N/A'} />
                                    <PDFItem label="Income" value={profile.annual_income || 'N/A'} />
                                    <PDFItem label="Company" value={profile.company_name || 'N/A'} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', borderBottom: '2px solid #F3F4F6', paddingBottom: '8px', marginBottom: '15px' }}>Religious Background</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <PDFItem label="Religion" value={profile.religion || 'Jain'} />
                                    <PDFItem label="Caste" value={profile.caste || 'N/A'} />
                                    <PDFItem label="Sect / Sub-Caste" value={profile.sub_caste || 'N/A'} />
                                    <PDFItem label="Gotra" value={profile.gotra || 'N/A'} />
                                    <PDFItem label="Manglik" value={profile.manglik || 'N/A'} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', borderBottom: '2px solid #F3F4F6', paddingBottom: '8px', marginBottom: '15px' }}>Family Background</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <PDFItem label="Father" value={profile.father_name || 'N/A'} />
                                    <PDFItem label="Mother" value={profile.mother_name || 'N/A'} />
                                    <PDFItem label="Siblings" value={profile.siblings || 'N/A'} />
                                    <PDFItem label="Family Type" value={profile.family_type || 'N/A'} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Sections in PDF */}
                    <div style={{ marginTop: '30px', spaceY: '20px' }}>
                        <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '20px', border: '1px solid #F3F4F6', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#111827', marginBottom: '10px' }}>About Candidate</h3>
                            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>{profile.about_me || 'No description provided'}</p>
                        </div>

                        {profile.hobbies && (
                            <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '20px', border: '1px solid #F3F4F6', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#111827', marginBottom: '10px' }}>Hobbies & Interests</h3>
                                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>{profile.hobbies}</p>
                            </div>
                        )}

                        {profile.expectations && (
                            <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '20px', border: '1px solid #F3F4F6' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#111827', marginBottom: '10px' }}>Partner Expectations</h3>
                                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>{profile.expectations}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// PDF Data Item
const PDFItem = ({ label, value }) => (
    <div style={{ marginBottom: '8px' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>{value}</p>
    </div>
);

// Helper component for info grid items
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 group">
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-saffron/10 group-hover:text-saffron transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-700">{value}</p>
        </div>
    </div>
);

export default ProfileDetail;
