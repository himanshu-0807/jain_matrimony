import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    ShieldCheck,
    CheckCircle,
    Users,
    Flame,
    MessageSquareQuote,
    ArrowRight,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Award,
    Heart,
    UserCheck,
    Lock,
    Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { getFeaturedProfiles } from '../services/profileService';
import { getSuccessStories } from '../services/successStoriesService';
import weddingHeroBg from '../assets/wedding_hero_bg.png';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentProfiles, setRecentProfiles] = useState([]);
    const [successStories, setSuccessStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileCount, setProfileCount] = useState(0);
    const [interests, setInterests] = useState(() => {
        const saved = localStorage.getItem('sentInterests');
        return saved ? JSON.parse(saved) : [];
    });

    // Fetch featured profiles and success stories on mount
    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        const [profilesResult, storiesResult] = await Promise.all([
            getFeaturedProfiles(),
            getSuccessStories()
        ]);

        if (!profilesResult.error && profilesResult.profiles) {
            setRecentProfiles(profilesResult.profiles);
            setProfileCount(profilesResult.profiles.length);
        }

        if (!storiesResult.error && storiesResult.stories) {
            setSuccessStories(storiesResult.stories);
        }

        setLoading(false);
    };

    // Jain and Marriage Quotes
    const quotes = [
        {
            text: "Ahimsa Paramo Dharma - Non-violence is the highest virtue",
            author: "Jain Philosophy"
        },
        {
            text: "A successful marriage requires falling in love many times, always with the same person",
            author: "Mignon McLaughlin"
        },
        {
            text: "Live and let live - The essence of Jain teachings",
            author: "Mahavira"
        },
        {
            text: "In Jainism, marriage is a sacred bond that unites two souls on their spiritual journey",
            author: "Ancient Wisdom"
        }
    ];

    const [currentQuote, setCurrentQuote] = useState(0);

    // Rotate quotes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleShowInterest = (profileId) => {
        const newInterests = [...interests, profileId];
        setInterests(newInterests);
        localStorage.setItem('sentInterests', JSON.stringify(newInterests));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse-profiles?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/browse-profiles');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section with Integrated Search */}
            <div className="relative h-[650px] md:h-[750px] overflow-hidden">
                {/* Hero Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-110"
                    style={{ backgroundImage: `url(${weddingHeroBg})` }}
                ></div>
                {/* Hero Overlay */}
                <div className="absolute inset-0 hero-overlay flex items-center justify-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white w-full">
                        <div className="animate-fade-in-up space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-8xl font-black mb-4 drop-shadow-2xl tracking-tighter">
                                    Your Sacred Journey <br /><span className="text-gold">Starts Here</span>
                                </h1>
                                <p className="text-xl md:text-3xl font-medium text-gold-light drop-shadow-lg max-w-3xl mx-auto">
                                    The most trusted community platform for joining Jain hearts world-wide.
                                </p>
                            </div>

                            {/* Integrated Search Box */}
                            <div className="max-w-4xl mx-auto glass-search p-2 md:p-3">
                                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Find profiles by name, city, or profession..."
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-900 bg-white shadow-inner focus:ring-4 focus:ring-saffron/20 border-none text-lg"
                                        />
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                    </div>
                                    <button type="submit" className="bg-saffron hover:bg-saffron-dark text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl hover:shadow-saffron/40 active:scale-95 flex items-center justify-center gap-2">
                                        Search
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                </form>
                                <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-widest text-white/90">
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-gold" />
                                        100% Privacy
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-gold" />
                                        Verified Profiles
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-gold" />
                                        Secure & Safe
                                    </span>
                                </div>
                            </div>

                            {/* Hero Stats */}
                            <div className="hidden md:flex justify-center gap-20 pt-10">
                                <div className="text-center group">
                                    <div className="text-4xl font-black text-gold mb-1 group-hover:scale-110 transition-transform">{profileCount}+</div>
                                    <div className="text-xs uppercase font-black tracking-[0.2em] text-white/70">Active Members</div>
                                </div>
                                <div className="text-center group">
                                    <div className="text-4xl font-black text-gold mb-1 group-hover:scale-110 transition-transform">500+</div>
                                    <div className="text-xs uppercase font-black tracking-[0.2em] text-white/70">Success Stories</div>
                                </div>
                                <div className="text-center group">
                                    <div className="text-4xl font-black text-gold mb-1 group-hover:scale-110 transition-transform">24/7</div>
                                    <div className="text-xs uppercase font-black tracking-[0.2em] text-white/70">Concierge Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Recently Added Section */}
                <div className="mb-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                        <div className="space-y-2">
                            <span className="text-saffron font-black tracking-[0.3em] uppercase text-xs flex items-center gap-2">
                                <Flame className="w-4 h-4" />
                                New Arrivals
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Recently Added Profiles</h2>
                            <div className="w-24 h-2 bg-saffron rounded-full"></div>
                        </div>
                        <button
                            onClick={() => navigate('/browse-profiles')}
                            className="text-saffron hover:bg-saffron hover:text-white px-6 py-3 rounded-xl border-2 border-saffron font-black transition-all flex items-center gap-2 group"
                        >
                            Explore All Profiles
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-saffron"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                            {recentProfiles.map(profile => (
                                <ProfileCard
                                    key={profile.id}
                                    profile={profile}
                                    onShowInterest={handleShowInterest}
                                    hasShownInterest={interests.includes(profile.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Why Choose Us - Modernized */}
                <div className="mb-32">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900">Why Choose Jain Matrimony?</h2>
                        <p className="text-gray-600 text-xl font-medium">We provide a secure and niche platform specifically tailored for the Jain community's values and traditions.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { icon: <ShieldCheck className="w-10 h-10" />, title: "100% Privacy", desc: "Advanced controls to manage who can see your information." },
                            { icon: <UserCheck className="w-10 h-10" />, title: "Verified Profiles", desc: "Every profile is manually screened for authenticity." },
                            { icon: <Sparkles className="w-10 h-10" />, title: "Community Centric", desc: "Designed exclusively for Jain families and traditions." },
                            { icon: <Heart className="w-10 h-10" />, title: "Matched for Life", desc: "100+ happy marriages successfully facilitated." }
                        ].map((feature, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-jain-cream border border-gold/10 text-center hover:border-saffron hover:shadow-2xl transition-all group hover:-translate-y-2">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm text-saffron group-hover:bg-saffron group-hover:text-white transition-colors duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How It Works - Simplified Flow */}
                <div className="mb-32 py-24 bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-20 space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-white">How It Works</h2>
                            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Simple steps to find your life partner in our community</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden lg:block absolute top-14 left-[20%] right-[20%] h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>

                            {[
                                { step: "01", icon: <UserCheck className="w-8 h-8" />, title: "Create Profile", desc: "Register and complete your detailed biodata for verification." },
                                { step: "02", icon: <Search className="w-8 h-8" />, title: "Search Partner", desc: "Use precision filters to find matches aligned with your values." },
                                { step: "03", icon: <Award className="w-8 h-8" />, title: "Get Married", desc: "Connect with families and begin your sacred journey together." }
                            ].map((item, i) => (
                                <div key={i} className="relative text-center group">
                                    <div className="w-28 h-28 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center text-gold mx-auto mb-8 shadow-2xl relative group-hover:bg-saffron transition-all duration-500 hover:rotate-12">
                                        <span className="absolute -top-4 -right-4 w-10 h-10 bg-saffron text-white rounded-full flex items-center justify-center font-black text-lg border-4 border-gray-900 ring-4 ring-saffron/20">{item.step}</span>
                                        <div className="group-hover:text-white transition-colors">{item.icon}</div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                                    <p className="text-gray-400 font-medium px-8 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Success Stories Section */}
                {successStories.length > 0 && (
                    <div className="mb-32">
                        <div className="text-center mb-20 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900">Couples Who Found Each Other</h2>
                            <p className="text-gray-600 text-xl font-medium max-w-2xl mx-auto">Witness the joy of successful matches from our community</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {successStories.slice(0, 3).map((story) => (
                                <div key={story.id} className="group overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <div className="h-64 overflow-hidden bg-gray-200 relative">
                                        {story.image_url ? (
                                            <img src={story.image_url} alt={story.couple_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">💑</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="p-10 relative">
                                        <div className="bg-saffron text-white w-12 h-12 rounded-2xl flex items-center justify-center absolute -top-6 right-10 shadow-xl border-4 border-white group-hover:rotate-12 transition-transform">
                                            <Heart className="w-6 h-6 fill-current" />
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{story.couple_name}</h4>
                                        <p className="text-saffron-dark font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Married {new Date(story.wedding_date).getFullYear()}
                                        </p>
                                        <div className="relative">
                                            <MessageSquareQuote className="w-8 h-8 text-gold/20 absolute -top-4 -left-4" />
                                            <p className="text-gray-600 italic leading-relaxed text-lg line-clamp-4 pl-4 border-l-2 border-gold/10">
                                                {story.story}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Repositioned Quote Section */}
                <div className="mb-32 py-24 px-8 rounded-[3rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-saffron rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10 transition-all duration-500">
                        <MessageSquareQuote className="w-20 h-20 text-gold/20 mx-auto mb-10" />
                        <p className="text-3xl md:text-5xl font-black italic mb-10 leading-tight tracking-tight px-4">
                            {quotes[currentQuote].text}
                        </p>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8 rounded-full"></div>
                        <p className="font-black tracking-[0.4em] uppercase text-sm text-gold">
                            — {quotes[currentQuote].author}
                        </p>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center rounded-[3.5rem] bg-gradient-to-br from-jain-cream to-white border border-gold/20 p-16 md:p-32 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                                Find Your Soulmate <br className="hidden md:block" /> Among <span className="text-saffron">Verified Jains</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
                                Join the most trusted community platform for Jain singles worldwide.
                                Manual verification ensures genuine profiles only.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-12 py-6 bg-saffron text-white rounded-[2rem] font-black text-2xl hover:bg-saffron-dark transition-all shadow-2xl hover:shadow-saffron/40 hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Register For Free
                                <ArrowRight className="w-8 h-8" />
                            </button>
                            <button
                                onClick={() => navigate('/browse-profiles')}
                                className="px-12 py-6 bg-white text-gray-900 border-2 border-gray-900 rounded-[2rem] font-black text-2xl hover:bg-gray-900 hover:text-white transition-all hover:-translate-y-2 active:scale-95"
                            >
                                Browse Profiles
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Footer */}
            <footer className="bg-gray-900 text-white pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
                        <div className="col-span-1 md:col-span-2 space-y-8">
                            <div className="text-4xl font-black tracking-tighter">
                                <span className="text-saffron">Jain</span>
                                <span className="text-gold"> Matrimony</span>
                            </div>
                            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                                Dedicated to helping you find your perfect life partner within the Jain community.
                                We prioritize tradition, values, and security above all else.
                            </p>
                            <div className="flex gap-6">
                                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-saffron transition-all hover:-translate-y-1 group">
                                    <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-saffron transition-all hover:-translate-y-1 group">
                                    <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-saffron transition-all hover:-translate-y-1 group">
                                    <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-saffron transition-all hover:-translate-y-1 group">
                                    <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </a>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-xl font-black uppercase tracking-widest text-gold">Quick Links</h4>
                            <ul className="space-y-5 text-lg font-medium text-gray-400">
                                <li><button onClick={() => navigate('/home')} className="hover:text-saffron transition-all hover:translate-x-2">Home</button></li>
                                <li><button onClick={() => navigate('/browse-profiles')} className="hover:text-saffron transition-all hover:translate-x-2">Browse Profiles</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-saffron transition-all hover:translate-x-2">Register</button></li>
                                <li><button onClick={() => navigate('/login')} className="hover:text-saffron transition-all hover:translate-x-2">Login</button></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-xl font-black uppercase tracking-widest text-gold">Contact Us</h4>
                            <ul className="space-y-6 text-lg font-medium text-gray-400">
                                <li className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-saffron shrink-0" />
                                    Mumbai, India
                                </li>
                                <li className="flex items-center gap-4">
                                    <Mail className="w-6 h-6 text-saffron shrink-0" />
                                    contact@jainmatri.com
                                </li>
                                <li className="flex items-center gap-4">
                                    <Phone className="w-6 h-6 text-saffron shrink-0" />
                                    +91 99999 99999
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-12 text-center">
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            © 2026 Jain Matrimony. All rights reserved. Live and let live.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
