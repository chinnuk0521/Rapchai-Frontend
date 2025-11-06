# 🔧 Fix: Supabase Redirecting Issues

## 🚨 The Problem

When clicking "Continue with Google" on your Vercel deployment, Supabase might redirect to the wrong URL instead of your Vercel callback URL.

## ✅ The Solution

The issue is **Supabase's Site URL configuration**. Supabase uses the Site URL from the dashboard as a fallback if the `redirectTo` parameter isn't respected.

### Step 1: Fix Supabase Site URL

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication → URL Configuration**
4. Set **Site URL** to:
   ```
   https://rapchai.vercel.app
   ```
   **NOT** `https://rapchai.vercel.app/auth/callback` ❌
   
   Just the base URL: `https://rapchai.vercel.app` ✅

5. In **Redirect URLs**, add:
   ```
   https://rapchai.vercel.app/auth/callback
   ```

6. Click **Save**

### Step 2: Verify Configuration

After saving, check the console logs when clicking "Continue with Google":

**Expected Console Output:**
```
🔍 URL Detection:
   Hostname: rapchai.vercel.app
   Origin: https://rapchai.vercel.app
   Redirect URL: https://rapchai.vercel.app/auth/callback
   Is Vercel: true
```

**If you see incorrect URLs in the logs:**
- The Site URL in Supabase might be incorrect
- Update it to your Vercel URL
- Redeploy your Vercel app after fixing

## 🔍 Why This Happens

1. **Supabase Site URL** might be incorrectly configured in dashboard
2. When OAuth completes, Supabase checks:
   - First: Does the `redirectTo` parameter match an allowed redirect URL?
   - If not: Falls back to Site URL
3. If Site URL is incorrect, it redirects to the wrong URL

## ✅ Code Fix Applied

The code now **hardcodes the production Vercel URL** in `CustomerAuthModal.tsx`:
```typescript
const PRODUCTION_URL = 'https://rapchai.vercel.app';
const redirectUrl = `${PRODUCTION_URL}/auth/callback`;
```

This ensures that:
- The `redirectTo` parameter **always** uses the Vercel URL
- Even if Supabase Site URL is set to localhost, the redirect will go to Vercel
- **BUT**: You must still add this URL to Supabase's **Redirect URLs** list, otherwise Supabase will reject it

## ✅ Correct Configuration

| Setting | Value |
|---------|-------|
| **Site URL** | `https://rapchai.vercel.app` |
| **Redirect URLs** | `https://rapchai.vercel.app/auth/callback` |

## 🧪 Testing

1. Deploy your code to Vercel
2. Open the Vercel deployment URL
3. Click "Continue with Google"
4. Check browser console - you should see the Vercel URL
5. After Google authentication, you should be redirected to:
   ```
   https://rapchai.vercel.app/auth/callback#access_token=...
   ```

## 🐛 If Still Not Working

1. **Clear browser cache** - Supabase might have cached redirect URLs
2. **Check Supabase logs** - Go to Supabase Dashboard → Logs → Auth logs
3. **Verify redirectTo parameter** - Check console logs to see what URL is being sent
4. **Check for typos** - Make sure the Vercel URL is exactly correct

## 📝 Quick Checklist

- [x] Code uses hardcoded production URL (already fixed)
- [ ] **CRITICAL**: Supabase Redirect URLs must include: `https://rapchai.vercel.app/auth/callback`
- [ ] Supabase Site URL should be set to: `https://rapchai.vercel.app` (optional, but recommended)
- [ ] Browser cache cleared
- [ ] Supabase changes saved

**Important**: Even though the code hardcodes the production URL, Supabase will **only** redirect to URLs that are in the **Redirect URLs** list. Make sure to add the Vercel callback URL there!

