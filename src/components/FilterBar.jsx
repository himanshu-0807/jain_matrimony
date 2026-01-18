import { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    MapPin,
    Sparkles,
    RotateCcw,
    ChevronDown,
    Filter
} from 'lucide-react';
import { getUniqueCities, getUniqueSects } from '../services/profileService';

const FilterBar = ({ filters, onFilterChange, onReset }) => {
    const [cities, setCities] = useState([]);
    const [jainSects, setJainSects] = useState([]);

    useEffect(() => {
        const loadFilterOptions = async () => {
            const [citiesRes, sectsRes] = await Promise.all([
                getUniqueCities(),
                getUniqueSects()
            ]);

            if (citiesRes.cities) setCities(citiesRes.cities);
            if (sectsRes.sects) setJainSects(sectsRes.sects);
        };

        loadFilterOptions();
    }, []);

    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-10 group transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-saffron/10 rounded-xl text-saffron">
                        <Filter className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Refine Your Search</h2>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-black text-saffron hover:bg-saffron/5 rounded-xl transition-all group/btn active:scale-95"
                >
                    <RotateCcw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                    Reset Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Looking For */}
                <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        Looking For
                    </label>
                    <div className="relative group/select">
                        <select
                            value={filters.lookingFor}
                            onChange={(e) => handleChange('lookingFor', e.target.value)}
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 font-bold appearance-none focus:bg-white focus:border-saffron/30 focus:ring-4 focus:ring-saffron/10 transition-all outline-none"
                        >
                            <option value="">All Profiles</option>
                            <option value="Male">Grooms Only</option>
                            <option value="Female">Brides Only</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover/select:text-saffron transition-colors" />
                    </div>
                </div>

                {/* Age Range */}
                <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Age Preference
                    </label>
                    <div className="relative group/select">
                        <select
                            value={filters.ageRange}
                            onChange={(e) => handleChange('ageRange', e.target.value)}
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 font-bold appearance-none focus:bg-white focus:border-saffron/30 focus:ring-4 focus:ring-saffron/10 transition-all outline-none"
                        >
                            <option value="">Any Age</option>
                            <option value="18-25">18 - 25 years</option>
                            <option value="26-30">26 - 30 years</option>
                            <option value="31-35">31 - 35 years</option>
                            <option value="36-40">36 - 40 years</option>
                            <option value="41+">41+ years</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover/select:text-saffron transition-colors" />
                    </div>
                </div>

                {/* City */}
                <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        Location
                    </label>
                    <div className="relative group/select">
                        <select
                            value={filters.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 font-bold appearance-none focus:bg-white focus:border-saffron/30 focus:ring-4 focus:ring-saffron/10 transition-all outline-none"
                        >
                            <option value="">Everywhere</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover/select:text-saffron transition-colors" />
                    </div>
                </div>

                {/* Jain Sect */}
                <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        Jain Sect
                    </label>
                    <div className="relative group/select">
                        <select
                            value={filters.jainSect}
                            onChange={(e) => handleChange('jainSect', e.target.value)}
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 font-bold appearance-none focus:bg-white focus:border-saffron/30 focus:ring-4 focus:ring-saffron/10 transition-all outline-none"
                        >
                            <option value="">All Sects</option>
                            {jainSects.map((sect) => (
                                <option key={sect} value={sect}>
                                    {sect}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover/select:text-saffron transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
