import { supabase } from '../lib/supabase';

/**
 * Registration Service
 * Handles registration applications with file uploads
 */

/**
 * Upload a file to Supabase Storage
 * @param {File} file - File to upload
 * @param {string} bucket - Storage bucket name
 * @param {string} folder - Folder path in bucket
 * @returns {Promise<{url, error}>}
 */
const uploadFile = async (file, bucket, folder) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error(`File upload error (${bucket}):`, error);
            return { url: null, error: error.message };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { url: publicUrl, error: null };

    } catch (err) {
        console.error('Upload error:', err);
        return { url: null, error: err.message };
    }
};

/**
 * Submit registration application
 * @param {Object} applicationData - Registration data
 * @param {string} applicationData.email
 * @param {string} applicationData.phone
 * @param {File} applicationData.biodataPdf
 * @param {File[]} applicationData.photos - Array of 5 photo files
 * @returns {Promise<{success, error}>}
 */
export const submitApplication = async (applicationData) => {
    try {
        const { email, phone, biodataPdf, photos, utrNumber, profileData } = applicationData;
        let biodataUrl = null;

        if (biodataPdf) {
            console.log('📤 Uploading biodata PDF...');
            const { url, error: uploadError } = await uploadFile(
                biodataPdf,
                'biodata-pdfs',
                email
            );

            if (uploadError) {
                return { success: false, error: `Failed to upload biodata: ${uploadError}` };
            }
            biodataUrl = url;
            console.log('✅ Biodata uploaded:', biodataUrl);
        }
        console.log('📤 Uploading photos...');

        // 2. Upload all photos
        const photoUrls = [];
        for (let i = 0; i < photos.length; i++) {
            const { url: photoUrl, error: photoError } = await uploadFile(
                photos[i],
                'profile-photos',
                `${email}/photo_${i + 1}`
            );

            if (photoError) {
                return { success: false, error: `Failed to upload photo ${i + 1}: ${photoError}` };
            }

            photoUrls.push(photoUrl);
        }

        console.log('✅ All photos uploaded:', photoUrls);
        console.log('💾 Saving application to database...');

        // 3. Save application to database
        const { data, error: dbError } = await supabase
            .from('registration_applications')
            .insert([
                {
                    email,
                    phone,
                    biodata_pdf_url: biodataUrl,
                    photo_urls: photoUrls,
                    utr_number: utrNumber,
                    profile_data: profileData,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error('Database insert error:', dbError);
            return { success: false, error: `Failed to save application: ${dbError.message}` };
        }

        console.log('✅ Application submitted successfully:', data);
        return { success: true, error: null };

    } catch (err) {
        console.error('Application submission error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Check if email or phone already has a pending/approved application
 * @param {string} email
 * @param {string} phone
 * @returns {Promise<{exists, status, error}>}
 */
export const checkExistingApplication = async (email, phone) => {
    try {
        const { data, error } = await supabase
            .from('registration_applications')
            .select('status')
            .or(`email.eq.${email},phone.eq.${phone}`)
            .in('status', ['pending', 'approved'])
            .limit(1);

        if (error) {
            console.error('Check application error:', error);
            return { exists: false, status: null, error: error.message };
        }

        if (data && data.length > 0) {
            return { exists: true, status: data[0].status, error: null };
        }

        return { exists: false, status: null, error: null };

    } catch (err) {
        console.error('Check application error:', err);
        return { exists: false, status: null, error: err.message };
    }
};
