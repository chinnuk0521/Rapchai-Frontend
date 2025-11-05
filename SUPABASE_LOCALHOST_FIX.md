# 🔧 Fix: Supabase Redirecting to Localhost Instead of Vercel

## 🚨 The Problem

When clicking "Continue with Google" on your Vercel deployment, Supabase redirects back to `localhost:3000/#access_token=...` instead of your Vercel URL.

## ✅ The Solution

The issue is **Supabase's Site URL configuration**. Supabase uses the Site URL from the dashboard as a fallback if the `redirectTo` parameter isn't respected.

### Step 1: Fix Supabase Site URL

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication → URL Configuration**
4. Set **Site URL** to:
   ```
   https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app
   ```
   **NOT** `http://localhost:3000` ❌
   **NOT** `https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback` ❌
   
   Just the base URL: `https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app` ✅

5. In **Redirect URLs**, add:
   ```
   https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

6. Click **Save**

### Step 2: Verify Configuration

After saving, check the console logs when clicking "Continue with Google":

**Expected Console Output:**
```
🔍 URL Detection:
   Hostname: rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app
   Origin: https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app
   Redirect URL: https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback
   Is Localhost: false
   Is Vercel: true
```

**If you see localhost in the logs:**
- The Site URL in Supabase is still set to localhost
- Update it to your Vercel URL
- Redeploy your Vercel app after fixing

## 🔍 Why This Happens

1. **Supabase Site URL** is set to `localhost:3000` in dashboard
2. When OAuth completes, Supabase checks:
   - First: Does the `redirectTo` parameter match an allowed redirect URL?
   - If not: Falls back to Site URL
3. If Site URL is `localhost:3000`, it redirects there even from Vercel

## ✅ Correct Configuration

| Setting | Value |
|---------|-------|
| **Site URL** | `https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app` |
| **Redirect URLs** | `https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback`<br>`http://localhost:3000/auth/callback` |

## 🧪 Testing

1. Deploy your code to Vercel
2. Open the Vercel deployment URL
3. Click "Continue with Google"
4. Check browser console - you should see the Vercel URL, not localhost
5. After Google authentication, you should be redirected to:
   ```
   https://rapchai-frontend-8om926b4t-chinnuk0521s-projects.vercel.app/auth/callback#access_token=...
   ```
   NOT `localhost:3000/#access_token=...`

## 🐛 If Still Not Working

1. **Clear browser cache** - Supabase might have cached redirect URLs
2. **Check Supabase logs** - Go to Supabase Dashboard → Logs → Auth logs
3. **Verify redirectTo parameter** - Check console logs to see what URL is being sent
4. **Check for typos** - Make sure the Vercel URL is exactly correct

## 📝 Quick Checklist

- [ ] Supabase Site URL = Vercel URL (not localhost)
- [ ] Redirect URLs include both Vercel and localhost
- [ ] Code uses `window.location.origin` (already correct)
- [ ] Console logs show Vercel URL, not localhost
- [ ] Browser cache cleared
- [ ] Supabase changes saved

