import { supabase } from '../lib/supabase';

/**
 * Success Stories Service
 * Handles CRUD operations for success stories
 */

/**
 * Get all success stories (active only for public)
 * @param {boolean} includeInactive - Include inactive stories (admin only)
 * @returns {Promise<{stories, error}>}
 */
export const getSuccessStories = async (includeInactive = false) => {
    try {
        let query = supabase
            .from('success_stories')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (!includeInactive) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Get success stories error:', error);
            return { stories: [], error: error.message };
        }

        return { stories: data || [], error: null };

    } catch (err) {
        console.error('Get success stories error:', err);
        return { stories: [], error: err.message };
    }
};

/**
 * Get single success story by ID
 * @param {string} id - Story ID
 * @returns {Promise<{story, error}>}
 */
export const getSuccessStory = async (id) => {
    try {
        const { data, error } = await supabase
            .from('success_stories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Get success story error:', error);
            return { story: null, error: error.message };
        }

        return { story: data, error: null };

    } catch (err) {
        console.error('Get success story error:', err);
        return { story: null, error: err.message };
    }
};

/**
 * Create new success story (admin only)
 * @param {Object} storyData - Story data
 * @returns {Promise<{success, error}>}
 */
export const createSuccessStory = async (storyData) => {
    try {
        const { error } = await supabase
            .from('success_stories')
            .insert([storyData]);

        if (error) {
            console.error('Create success story error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };

    } catch (err) {
        console.error('Create success story error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Update success story (admin only)
 * @param {string} id - Story ID
 * @param {Object} updates - Updated data
 * @returns {Promise<{success, error}>}
 */
export const updateSuccessStory = async (id, updates) => {
    try {
        const { error } = await supabase
            .from('success_stories')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Update success story error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };

    } catch (err) {
        console.error('Update success story error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Delete success story (admin only)
 * @param {string} id - Story ID
 * @returns {Promise<{success, error}>}
 */
export const deleteSuccessStory = async (id) => {
    try {
        const { error } = await supabase
            .from('success_stories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete success story error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };

    } catch (err) {
        console.error('Delete success story error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Toggle story active status
 * @param {string} id - Story ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<{success, error}>}
 */
export const toggleStoryStatus = async (id, isActive) => {
    return updateSuccessStory(id, { is_active: isActive });
};
