# Supabase Image Upload Setup Guide

## ✅ What's Been Configured

### 1. Supabase Storage Bucket
- **Bucket Name**: `restaurant-images`
- **Public Access**: Enabled
- **Folder Structure**: 
  - `categories/` - Category images
  - `menu-items/` - Menu item images

### 2. Storage Policies (SQL Executed)
```sql
-- Public read access
CREATE POLICY "Public read access for restaurant images" 
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'restaurant-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'restaurant-images');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update images" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'restaurant-images');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete images" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'restaurant-images');
```

### 3. Code Updates
- ✅ Installed `@supabase/supabase-js` package
- ✅ Created `src/lib/supabase.ts` with helper functions
- ✅ Updated image upload API route
- ✅ Enhanced admin dashboard forms with image upload
- ✅ Updated Category and MenuItem forms with folder specification
- ✅ Enhanced form visibility with better styling

### 4. Environment Variables Needed
Create `src/.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🚀 How to Use

### 1. Get Supabase Credentials
Go to your Supabase dashboard:
- Settings → API
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Create .env.local
Create the file `src/.env.local` with your credentials.

### 3. Test Image Upload
1. Visit `http://localhost:3000/admin/login`
2. Login with: `admin@rapchai.com` / `admin123`
3. Go to Categories or Menu Items tab
4. Click "Add" button
5. Upload an image using the 📷 button
6. Images will be uploaded to Supabase Storage!

## 📁 Image Storage Structure

```
restaurant-images/
├── categories/
│   ├── 1761724180984_mdf8kt7ow.png
│   └── ...
└── menu-items/
    ├── 1761724200456_xyz789ghi.jpg
    └── ...
```

## 🎯 Features

- ✅ Real-time image preview before upload
- ✅ Automatic file validation (images only, max 5MB)
- ✅ Unique filename generation (timestamp + random string)
- ✅ Category and Menu Item images organized in separate folders
- ✅ Public CDN URLs for fast global delivery
- ✅ Secure authentication-based uploads
- ✅ Easy image replacement and deletion

## 🔧 Troubleshooting

### Error: "Module not found: Can't resolve '@/lib/supabase'"
- Solution: File is at `src/lib/supabase.ts` ✓

### Error: "Login failed: 500 Internal Server Error"
- Solution: Make sure backend is running on port 3001
- Check: `netstat -ano | findstr ":3001"`

### Error: "Failed to upload image"
- Check Supabase bucket exists and is public
- Verify environment variables are set correctly
- Check browser console for detailed error messages

## 📝 Files Created/Modified

### New Files:
- `src/lib/supabase.ts` - Supabase client and helpers
- `src/app/api/upload/image/route.ts` - Image upload API
- `supabase-storage-policies.sql` - SQL policies

### Modified Files:
- `src/app/(site)/admin/dashboard/page.tsx` - Enhanced forms
- `src/app/lib/auth-hydration-safe.tsx` - Better error handling
- `src/env.example` - Added Supabase variables
- `next.config.ts` - Proxy configuration (existing)
