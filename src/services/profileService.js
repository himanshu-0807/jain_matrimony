import { supabase } from '../lib/supabase';

/**
 * Profile Service
 * Handles fetching and managing user profiles
 */

/**
 * Get all active profiles
 * @param {Object} filters - Optional filters
 * @returns {Promise<{profiles, error}>}
 */
export const getProfiles = async (filters = {}) => {
    try {
        let query = supabase
            .from('profiles')
            .select(`
                *,
                users!inner(email, phone, is_active, created_at)
            `)
            .eq('users.is_active', true);

        // Apply filters if provided
        if (filters.gender) {
            query = query.eq('gender', filters.gender);
        }
        if (filters.city) {
            query = query.ilike('city', `%${filters.city}%`);
        }
        if (filters.jainSect) {
            query = query.ilike('sub_caste', `%${filters.jainSect}%`);
        }

        // Search filter (across name, city, occupation, education)
        if (filters.search) {
            const searchPattern = `%${filters.search}%`;
            query = query.or(`full_name.ilike.${searchPattern},city.ilike.${searchPattern},occupation.ilike.${searchPattern},education.ilike.${searchPattern}`);
        }

        if (filters.minAge || filters.maxAge) {
            // Calculate birth year range from age
            const currentYear = new Date().getFullYear();
            if (filters.minAge) {
                const maxBirthYear = currentYear - filters.minAge;
                query = query.lte('date_of_birth', `${maxBirthYear}-12-31`);
            }
            if (filters.maxAge) {
                const minBirthYear = currentYear - filters.maxAge;
                query = query.gte('date_of_birth', `${minBirthYear}-01-01`);
            }
        }

        // Apply Sorting
        switch (filters.sortBy) {
            case 'oldest':
                query = query.order('created_at', { ascending: true });
                break;
            case 'age_asc':
                // Younger first = later birth date
                query = query.order('date_of_birth', { ascending: false });
                break;
            case 'age_desc':
                // Older first = earlier birth date
                query = query.order('date_of_birth', { ascending: true });
                break;
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false });
                break;
        }

        const { data, error } = await query;

        if (error) {
            console.error('Get profiles error:', error);
            return { profiles: [], error: error.message };
        }

        return { profiles: data, error: null };

    } catch (err) {
        console.error('Get profiles error:', err);
        return { profiles: [], error: err.message };
    }
};

/**
 * Get single profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<{profile, error}>}
 */
export const getProfileById = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                users!inner(id, email, phone, is_active, is_verified, role, created_at, updated_at)
            `)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.error('Get profile error:', error);
            return { profile: null, error: error.message };
        }

        return { profile: data, error: null };

    } catch (err) {
        console.error('Get profile error:', err);
        return { profile: null, error: err.message };
    }
};

/**
 * Get featured/recent profiles (limit to 6 for home page)
 * @returns {Promise<{profiles, error}>}
 */
export const getFeaturedProfiles = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                users!inner(email, phone, is_active, created_at)
            `)
            .eq('users.is_active', true)
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Get featured profiles error:', error);
            return { profiles: [], error: error.message };
        }

        return { profiles: data, error: null };

    } catch (err) {
        console.error('Get featured profiles error:', err);
        return { profiles: [], error: err.message };
    }
};

/**
 * Get all unique cities from profiles
 * @returns {Promise<{cities, error}>}
 */
export const getUniqueCities = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('city')
            .not('city', 'is', null);

        if (error) throw error;

        const uniqueCities = [...new Set(data.map(p => p.city))].sort();
        return { cities: uniqueCities, error: null };
    } catch (err) {
        console.error('Get unique cities error:', err);
        return { cities: [], error: err.message };
    }
};

/**
 * Get all unique Jain sects (sub_caste) from profiles
 * @returns {Promise<{sects, error}>}
 */
export const getUniqueSects = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('sub_caste')
            .not('sub_caste', 'is', null);

        if (error) throw error;

        const uniqueSects = [...new Set(data.map(p => p.sub_caste))].sort();
        return { sects: uniqueSects, error: null };
    } catch (err) {
        console.error('Get unique sects error:', err);
        return { sects: [], error: err.message };
    }
};

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns {number} - Age in years
 */
export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
