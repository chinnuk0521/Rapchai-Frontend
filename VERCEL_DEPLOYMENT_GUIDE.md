# 🚀 Vercel Deployment Guide for Rapchai Frontend

## 📋 Step-by-Step Vercel Configuration

### 1. Repository Selection
- **Repository**: `chinnuk0521/Rapchai-Frontend`
- **Branch**: `main` (or `latest-changes`)

### 2. Project Settings

Fill in these fields in Vercel:

| Field | Value | Notes |
|-------|-------|-------|
| **Project Name** | `rapchai-frontend` | Your choice |
| **Framework Preset** | `Next.js` | Auto-detected |
| **Root Directory** | `./` | Root of repository |
| **Build Command** | `npm run build` | Default Next.js build |
| **Output Directory** | `.next` | Next.js default (auto-detected) |
| **Install Command** | `npm install` | Default (or `yarn install`) |

### 3. Environment Variables

**⚠️ CRITICAL: Add these 3 variables BEFORE deploying**

Go to: **Settings → Environment Variables** (or add during setup)

Add each variable:

#### Variable 1: Backend API URL
```
Key: NEXT_PUBLIC_API_URL
Value: https://your-backend-url.com/api
```

**How to get:**
1. Deploy backend to Railway/Render first
2. Copy the backend URL
3. Add `/api` at the end
4. Example: `https://rapchai-api.railway.app/api`

#### Variable 2: Supabase URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-ref.supabase.co
```

**How to get:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to: **Settings → API**
4. Copy "Project URL"
5. Example: `https://ukdrlbhorhsaupkskfvy.supabase.co`

#### Variable 3: Supabase Anon Key
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your-anon-key-here
```

**How to get:**
1. Same page as above (Settings → API)
2. Copy "anon public" key
3. This is safe to expose (client-side only)

---

## 📁 Alternative: Import .env File

If Vercel supports importing .env files:

1. Download `.env.vercel` from the repository
2. Fill in the actual values
3. Import it in Vercel dashboard

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Backend deployed (Railway/Render) ✅
- [ ] Backend URL obtained
- [ ] Supabase project created
- [ ] Supabase credentials obtained
- [ ] Environment variables added in Vercel
- [ ] Repository connected

---

## 🔄 After Deployment

1. **First Deploy**: Will use default settings
2. **Add Environment Variables**: Go to Settings → Environment Variables
3. **Configure Supabase Redirect URLs**: 
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add redirect URL: `https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback`
   - Also add for development: `http://localhost:3000/auth/callback`
4. **Redeploy**: Trigger a new deployment

---

## 🐛 Troubleshooting

### Build Fails
- Check environment variables are added
- Ensure backend URL is accessible
- Verify Supabase credentials are correct

### API Calls Fail
- Check `NEXT_PUBLIC_API_URL` is correct (include `/api`)
- Verify backend is running and accessible
- Check CORS settings on backend

### Supabase Errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is active

---

## 📝 Quick Reference

**Vercel Settings:**
- Project Name: `rapchai-frontend`
- Framework: `Next.js`
- Root: `./`
- Build: `npm run build`
- Output: `.next` (default)

**Required Environment Variables:**
1. `NEXT_PUBLIC_API_URL`
2. `NEXT_PUBLIC_SUPABASE_URL`
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🎯 Next Steps

After successful deployment:

1. Test the deployed site
2. Check API connectivity
3. Test authentication (Google OAuth)
4. Verify image uploads work
5. Test ordering flow

---

Need help? Check the README.md for more details.


