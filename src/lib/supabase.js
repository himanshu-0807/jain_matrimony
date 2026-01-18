import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('Please create a .env file with:');
    console.error('VITE_SUPABASE_URL=your_project_url');
    console.error('VITE_SUPABASE_ANON_KEY=your_anon_key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection function
export const testConnection = async () => {
    try {
        console.log('🔄 Testing Supabase connection...');

        // Try to query the registration_applications table (has public read access)
        const { error } = await supabase
            .from('registration_applications')
            .select('id', { count: 'exact', head: true })
            .limit(1);

        if (error) {
            console.error('❌ Connection failed:', error.message);
            return false;
        }

        console.log('✅ Successfully connected to Supabase!');
        console.log('📊 Database is ready and accessible');
        return true;
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        return false;
    }
};
