# 🔐 OAuth Configuration Guide

## Understanding the OAuth Flow

The OAuth flow uses **two different redirect URLs** for different steps:

### OAuth Flow Diagram

```
1. User clicks "Continue with Google" on Frontend
   ↓
2. Frontend → Supabase (initiates OAuth)
   ↓
3. Supabase → Google (redirects user to Google login)
   ↓
4. Google authenticates user
   ↓
5. Google → Supabase callback
   URL: https://ukdrlbhorhsaupkskfvy.supabase.co/auth/v1/callback
   ↓
6. Supabase processes OAuth tokens
   ↓
7. Supabase → Frontend callback
   URL: https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback
   ↓
8. Frontend processes tokens and redirects to /home
```

## ⚠️ IMPORTANT: Supabase Site URL Configuration

**The most common issue:** If Supabase redirects to root instead of `/auth/callback`, check your Supabase **Site URL** configuration:

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Set **Site URL** to:
   ```
   https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app
   ```
   (NOT `/auth/callback` - just the base URL)

3. In **Redirect URLs**, add:
   ```
   https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback
   ```

**Why this matters:**
- If Site URL is wrong, Supabase might redirect to root with hash fragments
- The code has a handler that catches this and redirects to `/auth/callback`
- But it's better to configure Supabase correctly

---

## 🔧 URL Configuration

### Step 1: Google Cloud Console Configuration

**Where to configure:**
- Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID

**Authorized redirect URIs:**
```
https://ukdrlbhorhsaupkskfvy.supabase.co/auth/v1/callback
```

**Why this URL?**
- This is where Google redirects AFTER authentication
- Supabase handles the OAuth callback from Google
- This is Supabase's endpoint, not your frontend

**✅ Status:** Already configured correctly

---

### Step 2: Supabase Dashboard Configuration

**Where to configure:**
- Supabase Dashboard → Authentication → URL Configuration
- Or: Authentication → Providers → Google → Redirect URLs

**Site URL:**
```
https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app
```

**Redirect URLs:**
```
https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback
```

**Why this URL?**
- This is where Supabase redirects AFTER processing OAuth
- Your frontend callback page handles the tokens
- This is your frontend URL, not Supabase's URL

**✅ Status:** Already configured correctly

---

## 📝 Summary

| Configuration | URL | Purpose |
|--------------|-----|---------|
| **Google Cloud Console** | `https://ukdrlbhorhsaupkskfvy.supabase.co/auth/v1/callback` | Google → Supabase (after authentication) |
| **Supabase Dashboard** | `https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback` | Supabase → Frontend (after processing) |

## ✅ Verification Checklist

- [x] Google Cloud Console has Supabase callback URL
- [x] Supabase Dashboard has Frontend callback URL
- [x] Both URLs are correct and match the flow

## 🎯 Current Configuration

**Your setup is correct!** 

Both URLs are needed because:
1. **Google → Supabase**: Google needs to know where to redirect after authentication (Supabase handles this)
2. **Supabase → Frontend**: Supabase needs to know where to redirect after processing (Your frontend handles this)

The code automatically uses `window.location.origin` to detect the current domain for production deployment:
- Production: `https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app`

## 🔍 Testing

When you click "Continue with Google":
1. Check browser console - you'll see the OAuth flow explanation
2. You'll be redirected to Google for authentication
3. After authentication, Google redirects to Supabase
4. Supabase processes and redirects to your frontend
5. Frontend processes tokens and redirects to `/home`

## 🐛 Troubleshooting

**If OAuth doesn't work:**
1. Check Google Cloud Console has the Supabase URL
2. Check Supabase Dashboard has the Frontend URL
3. Check browser console for detailed logs
4. Verify environment variables are set correctly

