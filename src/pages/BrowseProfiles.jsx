import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    ChevronDown,
    Loader2,
    SearchX,
    LayoutGrid,
    SortAsc
} from 'lucide-react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import ProfileCard from '../components/ProfileCard';
import { getProfiles } from '../services/profileService';

const BrowseProfiles = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // States
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [interests, setInterests] = useState(() => {
        const saved = localStorage.getItem('sentInterests');
        return saved ? JSON.parse(saved) : [];
    });

    const [filters, setFilters] = useState({
        lookingFor: searchParams.get('gender') || '',
        ageRange: '',
        city: '',
        jainSect: ''
    });

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Fetch profiles from backend
    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        setError(null);

        // Parse age range
        let minAge, maxAge;
        if (filters.ageRange) {
            if (filters.ageRange === '41+') {
                minAge = 41;
            } else {
                [minAge, maxAge] = filters.ageRange.split('-').map(Number);
            }
        }

        const { profiles: data, error: fetchError } = await getProfiles({
            gender: filters.lookingFor,
            city: filters.city,
            jainSect: filters.jainSect,
            minAge,
            maxAge,
            search: searchQuery,
            sortBy
        });

        if (fetchError) {
            setError(fetchError);
        } else {
            setProfiles(data);
        }
        setLoading(false);
    }, [filters, searchQuery, sortBy]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const handleShowInterest = (profileId) => {
        const newInterests = [...interests, profileId];
        setInterests(newInterests);
        localStorage.setItem('sentInterests', JSON.stringify(newInterests));
    };

    const handleResetFilters = () => {
        setFilters({
            lookingFor: '',
            ageRange: '',
            city: '',
            jainSect: ''
        });
        setSearchQuery('');
        setSortBy('newest');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 text-saffron hover:text-saffron-dark font-black text-sm uppercase tracking-widest transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </button>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Browse Profiles</h1>
                            <p className="text-gray-500 font-medium text-lg mt-2">Find your perfect match from our trusted Jain community</p>
                        </div>
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 pl-3 text-gray-400">
                            <SortAsc className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Sort:</span>
                        </div>
                        <div className="relative group/select">
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-50 border-none rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-saffron/20 outline-none appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="age_asc">Age: Low to High</option>
                                <option value="age_desc">Age: High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Search Bar - Modern Glassmorphism Style */}
                <div className="mb-8 group">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, city, occupation, or education..."
                            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[2rem] text-lg font-bold text-gray-900 shadow-xl shadow-gray-200/50 focus:border-saffron/30 focus:ring-4 focus:ring-saffron/10 transition-all outline-none placeholder:text-gray-300"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-saffron transition-colors" />
                    </div>
                </div>

                {/* Filters */}
                <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                />

                {/* Status and Results Count */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <p className="text-gray-600 font-bold">
                            {loading ? (
                                <span className="flex items-center gap-2 italic">
                                    <Loader2 className="w-4 h-4 animate-spin text-saffron" />
                                    Finding matches...
                                </span>
                            ) : (
                                <div className="text-lg">
                                    <span className="text-gray-900">Found </span>
                                    <span className="text-saffron font-black px-1">{profiles.length}</span>
                                    <span className="text-gray-900">Profiles</span>
                                    {searchQuery && <span className="text-gray-400 font-medium ml-2">for "{searchQuery}"</span>}
                                </div>
                            )}
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-100 text-red-600 p-6 rounded-3xl mb-10 flex items-center gap-4 font-bold">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                            <X className="w-6 h-6" />
                        </div>
                        {error}
                    </div>
                )}

                {/* Profile Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-white border border-gray-100 h-[500px] rounded-[2.5rem] shadow-sm"></div>
                        ))}
                    </div>
                ) : profiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profiles.map(profile => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                onShowInterest={handleShowInterest}
                                hasShownInterest={interests.includes(profile.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
                            <SearchX className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">No Profiles Found</h3>
                        <p className="text-gray-500 font-medium text-lg max-w-md mx-auto mb-10">
                            {searchQuery
                                ? `We couldn't find any profiles matching "${searchQuery}". Try using broader terms.`
                                : "No profiles currently match your selected filters. Try adjusting your preferences."
                            }
                        </p>
                        <button
                            onClick={handleResetFilters}
                            className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-saffron transition-all shadow-xl hover:shadow-saffron/30 active:scale-95 flex items-center gap-3 mx-auto"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseProfiles;
