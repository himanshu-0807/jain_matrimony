import { supabase } from '../lib/supabase';

/**
 * Interest Service
 * Handles sending and receiving interests between users
 */

/**
 * Send interest to a profile
 * @param {string} fromUserId - Current user's ID
 * @param {string} toUserId - Target profile's user ID
 * @returns {Promise<{success, error}>}
 */
export const sendInterest = async (fromUserId, toUserId) => {
    try {
        // Check if interest already sent
        const { data: existing } = await supabase
            .from('interests')
            .select('id')
            .eq('sender_id', fromUserId)
            .eq('receiver_id', toUserId)
            .single();

        if (existing) {
            return { success: false, error: 'Interest already sent to this profile' };
        }

        // Send interest
        const { error } = await supabase
            .from('interests')
            .insert([
                {
                    sender_id: fromUserId,
                    receiver_id: toUserId,
                    status: 'pending'
                }
            ]);

        if (error) {
            console.error('Send interest error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };

    } catch (err) {
        console.error('Send interest error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Get sent interests for current user
 * @param {string} userId - Current user's ID
 * @returns {Promise<{interests, error}>}
 */
export const getSentInterests = async (userId) => {
    try {
        // Get interests
        const { data: interests, error: interestsError } = await supabase
            .from('interests')
            .select('*')
            .eq('sender_id', userId)
            .order('created_at', { ascending: false });

        if (interestsError) {
            console.error('Get sent interests error:', interestsError);
            return { interests: [], error: interestsError.message };
        }

        if (!interests || interests.length === 0) {
            return { interests: [], error: null };
        }

        // Get profile details for each interest
        const receiverIds = interests.map(i => i.receiver_id);
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select(`
                *,
                users!inner(email, phone, is_active)
            `)
            .in('user_id', receiverIds);

        if (profilesError) {
            console.error('Get profiles error:', profilesError);
            // Return interests without profile data
            return { interests, error: null };
        }

        // Merge profile data with interests
        const interestsWithProfiles = interests.map(interest => ({
            ...interest,
            to_profile: profiles?.find(p => p.user_id === interest.receiver_id)
        }));

        return { interests: interestsWithProfiles, error: null };

    } catch (err) {
        console.error('Get sent interests error:', err);
        return { interests: [], error: err.message };
    }
};

/**
 * Get received interests for current user
 * @param {string} userId - Current user's ID
 * @returns {Promise<{interests, error}>}
 */
export const getReceivedInterests = async (userId) => {
    try {
        // Get interests
        const { data: interests, error: interestsError } = await supabase
            .from('interests')
            .select('*')
            .eq('receiver_id', userId)
            .order('created_at', { ascending: false });

        if (interestsError) {
            console.error('Get received interests error:', interestsError);
            return { interests: [], error: interestsError.message };
        }

        if (!interests || interests.length === 0) {
            return { interests: [], error: null };
        }

        // Get profile details for each interest
        const senderIds = interests.map(i => i.sender_id);
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select(`
                *,
                users!inner(email, phone, is_active)
            `)
            .in('user_id', senderIds);

        if (profilesError) {
            console.error('Get profiles error:', profilesError);
            // Return interests without profile data
            return { interests, error: null };
        }

        // Merge profile data with interests
        const interestsWithProfiles = interests.map(interest => ({
            ...interest,
            from_profile: profiles?.find(p => p.user_id === interest.sender_id)
        }));

        return { interests: interestsWithProfiles, error: null };

    } catch (err) {
        console.error('Get received interests error:', err);
        return { interests: [], error: err.message };
    }
};

/**
 * Accept an interest
 * @param {string} interestId - Interest ID
 * @returns {Promise<{success, error}>}
 */
export const acceptInterest = async (interestId) => {
    try {
        const { error } = await supabase
            .from('interests')
            .update({ status: 'accepted' })
            .eq('id', interestId);

        if (error) {
            console.error('Accept interest error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };

    } catch (err) {
        console.error('Accept interest error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Reject an interest
 * @param {string} interestId - Interest ID
 * @returns {Promise<{success, error}>}
 */
export const rejectInterest = async (interestId) => {
    try {
        const { error } = await supabase
            .from('interests')
            .update({ status: 'rejected' })
            .eq('id', interestId);

        if (error) {
            console.error('Reject interest error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };

    } catch (err) {
        console.error('Reject interest error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Check if current user has sent interest to a profile
 * @param {string} fromUserId - Current user's ID
 * @param {string} toUserId - Target profile's user ID
 * @returns {Promise<{hasSent, error}>}
 */
export const hasInterestSent = async (fromUserId, toUserId) => {
    try {
        const { data, error } = await supabase
            .from('interests')
            .select('id')
            .eq('sender_id', fromUserId)
            .eq('receiver_id', toUserId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Check interest error:', error);
            return { hasSent: false, error: error.message };
        }

        return { hasSent: !!data, error: null };

    } catch (err) {
        console.error('Check interest error:', err);
        return { hasSent: false, error: err.message };
    }
};
