import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

/**
 * Simple Authentication Service (Table-Based, No Supabase Auth)
 * Uses only the users table for authentication
 */

/**
 * Register a new user (for admin approval workflow)
 * @param {string} email 
 * @param {string} password 
 * @param {string} phone 
 * @returns {Promise<{user, error}>}
 */
export const registerSimple = async (email, password, phone) => {
    try {
        console.log('📝 Creating user account (table-based)...');

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert directly into users table
        const { data: user, error } = await supabase
            .from('users')
            .insert([
                {
                    email,
                    phone,
                    password_hash: passwordHash,
                    role: 'user',
                    is_verified: true, // Auto-verify since admin approved
                    is_active: true
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('User creation error:', error);
            return { user: null, error: error.message };
        }

        console.log('✅ User created successfully:', user);
        return { user, error: null };

    } catch (err) {
        console.error('Registration error:', err);
        return { user: null, error: err.message };
    }
};

/**
 * Revoke user access (Delete Account)
 * @param {string} userId 
 * @returns {Promise<{success, error}>}
 */
export const revokeAccess = async (userId) => {
    try {
        console.log('🚨 Revoking access for user:', userId);

        // 1. Delete from profiles (if not cascaded)
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('user_id', userId);

        if (profileError) {
            console.error('❌ Error deleting profile:', profileError);
            // Continue trying to delete user even if profile delete fails (orphan cleanup might handle it)
        }

        // 2. Delete from users table
        const { error: userError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (userError) {
            console.error('❌ Error deleting user:', userError);
            return { success: false, error: userError.message };
        }

        console.log('✅ Account revoked successfully');
        return { success: true, error: null };
    } catch (err) {
        console.error('❌ Unexpected error revoking access:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Login user (table-based authentication)
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user, session, error}>}
 */
export const loginSimple = async (email, password = null) => {
    try {
        console.log('🔐 ===== LOGIN DEBUG START =====');
        console.log('📧 Email:', email);
        console.log('🔑 Password length:', password?.length);
        console.log('🔍 Querying database for user...');

        // Get user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        console.log('📊 Database query result:');
        console.log('  - Error:', error);
        console.log('  - User found:', !!user);

        if (user) {
            console.log('  - User ID:', user.id);
            console.log('  - User email:', user.email);
            console.log('  - User role:', user.role);
            console.log('  - User is_active:', user.is_active);
            console.log('  - Password hash exists:', !!user.password_hash);
            console.log('  - Password hash length:', user.password_hash?.length);
        }

        if (error || !user) {
            console.error('❌ User not found or database error');
            console.error('   Error details:', JSON.stringify(error, null, 2));
            return { user: null, session: null, error: 'Invalid email' };
        }

        // Check if user is active
        if (!user.is_active) {
            console.error('❌ User account is inactive');
            return { user: null, session: null, error: 'Account is inactive. Please contact admin.' };
        }

        if (user.role === 'admin') {
            console.log('👮 Admin login detected, enforcing password check...');

            if (!password) {
                return { user: null, session: null, error: 'Password is required for admin login' };
            }

            console.log('🔐 Verifying password with bcrypt...');
            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                console.error('❌ Password does not match');
                return { user: null, session: null, error: 'Invalid email or password' };
            }
            console.log('✅ Admin password verified');
        } else {
            console.log('👤 User login detected, skipping password check...');
            // For regular users, we still check verification status
            if (!user.is_verified) {
                console.error('❌ User is not verified');
                return { user: null, session: null, error: 'Your account is not approved yet.' };
            }
            console.log('✅ User verified (whitelist check passed)');
            console.log('✅ Login successful (Passwordless Mode)');
        }

        console.log('✅ Password verified successfully!');
        console.log('✅ Login successful');

        // Create a simple session object
        const session = {
            user_id: user.id,
            email: user.email,
            role: user.role,
            created_at: new Date().toISOString()
        };

        console.log('📦 Session created:', session);
        console.log('🔐 ===== LOGIN DEBUG END =====');

        return { user, session, error: null };

    } catch (err) {
        console.error('💥 ===== LOGIN ERROR =====');
        console.error('Error type:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('💥 ===== LOGIN ERROR END =====');
        return { user: null, session: null, error: err.message };
    }
};

/**
 * Logout (simple - just clear local storage)
 */
export const logoutSimple = async () => {
    // No server-side session to clear
    console.log('👋 Logging out...');
    return { error: null };
};

/**
 * Get current user from local storage
 */
export const getCurrentUserSimple = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch (err) {
        return null;
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticatedSimple = () => {
    return !!getCurrentUserSimple();
};

/**
 * Update password
 * @param {string} userId 
 * @param {string} newPassword 
 */
export const updatePasswordSimple = async (userId, newPassword) => {
    try {
        const passwordHash = await bcrypt.hash(newPassword, 10);

        const { error } = await supabase
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, error: null };

    } catch (err) {
        return { success: false, error: err.message };
    }
};

/**
 * Change password (requires old password verification)
 * @param {string} email 
 * @param {string} oldPassword 
 * @param {string} newPassword 
 */
export const changePassword = async (email, oldPassword, newPassword) => {
    try {
        console.log('🔐 Changing password for:', email);

        // 1. Get user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return { success: false, error: 'User not found' };
        }

        // 2. Verify old password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password_hash);

        if (!passwordMatch) {
            return { success: false, error: 'Current password is incorrect' };
        }

        // 3. Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // 4. Update password
        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: newPasswordHash })
            .eq('id', user.id);

        if (updateError) {
            return { success: false, error: updateError.message };
        }

        console.log('✅ Password changed successfully');
        return { success: true, error: null };

    } catch (err) {
        console.error('Change password error:', err);
        return { success: false, error: err.message };
    }
};

// Export as default methods (backward compatible)
export const register = registerSimple;
export const login = loginSimple;
export const logout = logoutSimple;
export const getCurrentUser = getCurrentUserSimple;
export const isAuthenticated = isAuthenticatedSimple;
export const updatePassword = updatePasswordSimple;
