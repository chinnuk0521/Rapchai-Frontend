import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please create src/.env.local with:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name
export const STORAGE_BUCKET = 'restaurant-images';

// Helper function to upload image to Supabase Storage
export async function uploadImageToSupabase(
  file: File,
  folder: 'categories' | 'menu-items',
  filename?: string
): Promise<{ imageUrl: string; path: string }> {
  try {
    // Generate unique filename if not provided
    const finalFilename = filename || `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;
    
    // Create file path
    const filePath = `${folder}/${finalFilename}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      imageUrl: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
}

// Helper function to delete image from Supabase Storage
export async function deleteImageFromSupabase(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
}
