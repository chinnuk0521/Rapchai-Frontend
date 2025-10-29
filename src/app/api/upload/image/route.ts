import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;
    const folder: 'categories' | 'menu-items' = (data.get('folder') as string) || 'menu-items';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const { imageUrl, path } = await uploadImageToSupabase(file, folder);

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      path,
      filename: path.split('/').pop(),
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check if it's a Supabase configuration error
      if (error.message.includes('Missing Supabase environment variables')) {
        errorMessage = 'Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to src/.env.local';
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
