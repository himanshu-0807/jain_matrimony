import { supabase } from '../lib/supabase';
import { register } from './authService';

/**
 * Admin Service
 * Handles admin-specific operations for managing registration applications
 */

/**
 * Generate a password based on user's name with random digits
 * @param {string} fullName - User's full name (optional)
 * @returns {string} - Password in format: Name@1234
 */
export const generatePassword = (fullName = '') => {
    // If name is provided, use it; otherwise use "User"
    let namePart = 'User';

    if (fullName && fullName.trim()) {
        // Take first name, capitalize first letter, remove spaces
        const firstName = fullName.trim().split(' ')[0];
        namePart = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }

    // Generate 4 random digits
    const digits = Math.floor(1000 + Math.random() * 9000); // 4-digit number (1000-9999)

    // Format: Name@1234
    return `${namePart}@${digits}`;
};

/**
 * Get all pending registration applications
 * @returns {Promise<{applications, error}>}
 */
export const getPendingApplications = async () => {
    try {
        const { data, error } = await supabase
            .from('registration_applications')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch pending applications error:', error);
            return { applications: [], error: error.message };
        }

        return { applications: data, error: null };

    } catch (err) {
        console.error('Get pending applications error:', err);
        return { applications: [], error: err.message };
    }
};

/**
 * Get all applications (pending, approved, rejected)
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<{applications, error}>}
 */
export const getAllApplications = async (status = null) => {
    try {
        let query = supabase
            .from('registration_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Fetch applications error:', error);
            return { applications: [], error: error.message };
        }

        return { applications: data, error: null };

    } catch (err) {
        console.error('Get applications error:', err);
        return { applications: [], error: err.message };
    }
};

/**
 * Get single application by ID
 * @param {string} id - Application ID
 * @returns {Promise<{application, error}>}
 */
export const getApplicationById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('registration_applications')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Fetch application error:', error);
            return { application: null, error: error.message };
        }

        return { application: data, error: null };

    } catch (err) {
        console.error('Get application error:', err);
        return { application: null, error: err.message };
    }
};

/**
 * Approve application and create user account
 * @param {string} applicationId - Application ID
 * @param {Object} profileData - Complete profile data
 * @param {string} password - Generated password for user
 * @param {Object} modifiedApplication - Modified application with corrected email/phone (optional)
 * @returns {Promise<{success, user, credentials, error}>}
 */
export const approveApplication = async (applicationId, profileData, password, modifiedApplication = null) => {
    try {
        console.log('🔄 Starting approval process for application:', applicationId);

        // 1. Get application details (use modified if provided)
        let application;
        if (modifiedApplication) {
            application = modifiedApplication;
            console.log('📝 Using modified application data:', { email: application.email, phone: application.phone });
        } else {
            const { application: appData, error: appError } = await getApplicationById(applicationId);
            if (appError || !appData) {
                return { success: false, user: null, credentials: null, error: appError || 'Application not found' };
            }
            application = appData;
        }

        console.log('📧 Creating user account...');

        // 2. Create user account using simple table-based registration (no Supabase Auth)
        const { user: newUser, error: registerError } = await register(
            application.email,
            password,
            application.phone
        );

        if (registerError || !newUser) {
            console.error('User creation failed:', registerError);
            return { success: false, user: null, credentials: null, error: registerError || 'Failed to create user' };
        }

        console.log('✅ User account created:', newUser.id);
        console.log('👤 Creating profile...');

        // 3. Clean profile data - convert empty strings to null for proper database insertion
        const cleanedProfileData = Object.fromEntries(
            Object.entries(profileData).map(([key, value]) => [
                key,
                value === '' ? null : value
            ])
        );

        // 4. Create profile with all the data
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    user_id: newUser.id,
                    ...cleanedProfileData,
                    profile_photo_url: application.photo_urls[0] || null, // First photo as profile photo
                    photo_urls: application.photo_urls,
                    biodata_pdf_url: application.biodata_pdf_url
                }
            ])
            .select()
            .single();

        if (profileError) {
            console.error('Profile creation failed:', profileError);
            // Rollback: delete the user
            await supabase.from('users').delete().eq('id', newUser.id);
            return { success: false, user: null, credentials: null, error: profileError.message };
        }

        console.log('✅ Profile created:', profile.id);
        console.log('🗑️ Removing application from pending list...');
        console.log('   Application ID to delete:', applicationId);

        // 5. Delete the application from registration_applications table
        // (Data is now in profiles table, no need to keep the application)
        const { data: deleteData, error: deleteError } = await supabase
            .from('registration_applications')
            .delete()
            .eq('id', applicationId)
            .select();

        console.log('🗑️ Delete operation result:');
        console.log('   Error:', deleteError);
        console.log('   Deleted rows:', deleteData);

        if (deleteError) {
            console.error('❌ Application deletion failed:', deleteError);
            console.error('   Error code:', deleteError.code);
            console.error('   Error message:', deleteError.message);
            console.error('   Error details:', JSON.stringify(deleteError, null, 2));
            // Don't fail the approval if deletion fails - user is already created
            console.warn('⚠️ User created successfully but application record could not be deleted');
        } else {
            console.log('✅ Application removed from pending list');
            console.log('   Deleted count:', deleteData?.length || 0);
        }

        const credentials = {
            email: application.email,
            phone: application.phone,
            password: password,
            userId: newUser.id,
            profileId: profile.id
        };

        return { success: true, user: newUser, credentials, error: null };

    } catch (err) {
        console.error('Approval process error:', err);
        return { success: false, user: null, credentials: null, error: err.message };
    }
};

/**
 * Reject application
 * @param {string} applicationId - Application ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<{success, error}>}
 */
export const rejectApplication = async (applicationId, reason) => {
    try {
        console.log('❌ Rejecting application:', applicationId);

        const { error } = await supabase
            .from('registration_applications')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                review_notes: reason
            })
            .eq('id', applicationId);

        if (error) {
            console.error('Rejection failed:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Application rejected');
        return { success: true, error: null };

    } catch (err) {
        console.error('Reject application error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Get application statistics
 * @returns {Promise<{stats, error}>}
 */
export const getApplicationStats = async () => {
    try {
        const { data, error } = await supabase
            .from('registration_applications')
            .select('status');

        if (error) {
            console.error('Fetch stats error:', error);
            return { stats: null, error: error.message };
        }

        const stats = {
            total: data.length,
            pending: data.filter(app => app.status === 'pending').length,
            approved: data.filter(app => app.status === 'approved').length,
            rejected: data.filter(app => app.status === 'rejected').length
        };

        return { stats, error: null };

    } catch (err) {
        console.error('Get stats error:', err);
        return { stats: null, error: err.message };
    }
};

/**
 * Verify if current user is admin
 * @returns {Promise<boolean>}
 */
export const isAdmin = async () => {
    try {
        // Get user from localStorage
        const userStr = localStorage.getItem('user') || localStorage.getItem('adminUser');

        if (!userStr) return false;

        const user = JSON.parse(userStr);
        return user?.role === 'admin';

    } catch (err) {
        console.error('Admin check error:', err);
        return false;
    }
};

/**
 * Get total profiles count
 * @returns {Promise<{count, error}>}
 */
export const getProfilesCount = async () => {
    try {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Get profiles count error:', error);
            return { count: 0, error: error.message };
        }

        return { count, error: null };

    } catch (err) {
        console.error('Get profiles count error:', err);
        return { count: 0, error: err.message };
    }
};

/**
 * Get all approved profiles with user details
 * @param {Object} filters - Optional filters (gender, city, etc.)
 * @returns {Promise<{profiles, error}>}
 */
export const getAllProfiles = async (filters = {}) => {
    try {
        let query = supabase
            .from('profiles')
            .select(`
                *,
                users!inner(email, phone, is_active, created_at)
            `)
            .order('created_at', { ascending: false });

        // Apply filters if provided
        if (filters.gender) {
            query = query.eq('gender', filters.gender);
        }
        if (filters.city) {
            query = query.ilike('city', `%${filters.city}%`);
        }
        if (filters.search) {
            query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
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
 * Get single profile by user ID with all details
 * @param {string} userId - User ID
 * @returns {Promise<{profile, error}>}
 */
export const getProfileByUserId = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                users!inner(id, email, phone, is_active, is_verified, role, created_at, updated_at)
            `)
            .eq('user_id', userId)
            .single();

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
 * Delete user profile and account
 * @param {string} userId - User ID to delete
 * @returns {Promise<{success, error}>}
 */
export const deleteUserProfile = async (userId) => {
    try {
        console.log('🗑️ Deleting user profile:', userId);

        // 1. Delete profile first (due to foreign key constraint)
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('user_id', userId);

        if (profileError) {
            console.error('Profile deletion failed:', profileError);
            return { success: false, error: profileError.message };
        }

        console.log('✅ Profile deleted');

        // 2. Delete user account
        const { error: userError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (userError) {
            console.error('User deletion failed:', userError);
            return { success: false, error: userError.message };
        }

        console.log('✅ User account deleted');
        return { success: true, error: null };

    } catch (err) {
        console.error('Delete user error:', err);
        return { success: false, error: err.message };
    }
};
