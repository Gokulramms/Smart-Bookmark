# Smart Bookmark App - Deployment Guide

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Supabase project created
- [ ] Database schema applied (run `supabase-schema.sql`)
- [ ] Google OAuth configured in Supabase
- [ ] Google Cloud OAuth credentials created
- [ ] Gemini API key obtained
- [ ] Code committed to Git repository
- [ ] All environment variables ready

## 🗄️ Supabase Setup (Detailed)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization (or create one)
4. Enter project details:
   - **Name**: smart-bookmark-app
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### Step 2: Apply Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of `supabase-schema.sql`
4. Paste into editor
5. Click "Run" (or press Ctrl/Cmd + Enter)
6. Verify success: Check **Database** → **Tables** to see `bookmarks` table

### Step 3: Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. Select `bookmarks` table
3. Verify 4 policies exist:
   - Users can view own bookmarks (SELECT)
   - Users can insert own bookmarks (INSERT)
   - Users can update own bookmarks (UPDATE)
   - Users can delete own bookmarks (DELETE)

### Step 4: Enable Realtime

1. Go to **Database** → **Replication**
2. Find `bookmarks` table
3. Toggle "Realtime" to ON
4. Alternatively, verify SQL was run:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
   ```

### Step 5: Configure Google OAuth

#### In Google Cloud Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth Client ID**
6. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: Smart Bookmark
   - User support email: your email
   - Developer contact: your email
   - Save and Continue (skip scopes, test users)
7. Back to Create OAuth Client ID:
   - Application type: Web application
   - Name: Smart Bookmark App
   - Authorized redirect URIs:
     ```
     https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
     ```
   - Click Create
8. **Copy** Client ID and Client Secret

#### In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle "Enable Sign in with Google" to ON
4. Paste:
   - **Client ID**: from Google Cloud
   - **Client Secret**: from Google Cloud
5. Click **Save**

### Step 6: Get Supabase Keys

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** → This is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → This is `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important**: Never share service_role key publicly!

## 🤖 Google Gemini API Setup

### Step 1: Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select existing Google Cloud project or create new
4. Click "Create API key in new project"
5. **Copy** the API key immediately (you can't see it again!)

### Step 2: Test API Key (Optional)

```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

If successful, you'll get a JSON response with AI-generated content.

## 🌐 Vercel Deployment

### Option 1: Vercel CLI (Recommended)

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Login to Vercel

```bash
vercel login
```

#### Deploy

```bash
# From project root
cd smart-bookmark-app

# First deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: smart-bookmark-app
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Set Environment Variables

```bash
# Set each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste value, select Production, Development, Preview

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
```

Or use Vercel dashboard (see Option 2).

### Option 2: Vercel Dashboard (Easier)

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"
git branch -M main

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/smart-bookmark-app.git
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or `smart-bookmark-app` if in subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

#### Step 3: Add Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbG... | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbG... | Production, Preview, Development |
| `GEMINI_API_KEY` | AIzaSy... | Production, Preview, Development |

3. Click "Save"

#### Step 4: Deploy

1. Go to **Deployments** tab
2. Click "Redeploy" to trigger build with new env vars
3. Wait for build to complete (~2-3 minutes)
4. Click on deployment URL to test

### Step 5: Update OAuth Redirects

After deployment, update Google OAuth:

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth Client ID
3. Add production redirect URI:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
4. Add your Vercel domain to authorized origins:
   ```
   https://your-app.vercel.app
   ```
5. Save

Also update in Supabase:
1. Go to Authentication → URL Configuration
2. Add Site URL: `https://your-app.vercel.app`
3. Add Redirect URL: `https://your-app.vercel.app/**`

## ✅ Post-Deployment Verification

### 1. Test Basic Functionality

- [ ] Open production URL
- [ ] Landing page loads correctly
- [ ] Click "Sign In" → redirects to login
- [ ] Click "Continue with Google" → OAuth flow works
- [ ] After login → redirects to dashboard
- [ ] Dashboard shows empty state

### 2. Test Bookmark Creation

- [ ] Click "Add Bookmark"
- [ ] Enter URL: `https://github.com`
- [ ] Leave title empty
- [ ] Click "Add Bookmark"
- [ ] Wait for AI processing (should take 5-10 seconds)
- [ ] Bookmark appears with:
  - AI-generated title
  - Summary
  - Category
  - Tags
  - GitHub favicon

### 3. Test Realtime

- [ ] Open app in new tab (same browser)
- [ ] Add bookmark in Tab 1
- [ ] Verify bookmark appears in Tab 2 with toast notification
- [ ] Delete bookmark in Tab 2
- [ ] Verify bookmark removed from Tab 1

### 4. Test Duplicate Detection

- [ ] Try adding same URL again
- [ ] Should show duplicate warning toast
- [ ] Bookmark should not be added

### 5. Test Search & Filters

- [ ] Add 3-4 bookmarks in different categories
- [ ] Use search bar to find bookmark
- [ ] Filter by category
- [ ] Filter by tag
- [ ] Verify results update correctly

## 🐛 Common Deployment Issues

### Issue: "Invalid Supabase URL"

**Cause**: Environment variable not set or incorrect

**Solution**:
```bash
# Check env vars in Vercel
vercel env ls

# They should all show ✓ for Production

# If missing, add them:
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

### Issue: OAuth Redirect Error

**Cause**: Redirect URI mismatch

**Solution**:
- Verify redirect URI in Google Cloud matches Supabase exactly
- Format: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
- Check for trailing slash (should NOT have one)
- Verify Supabase Site URL includes your Vercel domain

### Issue: AI Features Not Working

**Cause**: Gemini API key invalid or missing

**Solution**:
```bash
# Test API key
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'

# If error, regenerate key in AI Studio
# Update in Vercel:
vercel env rm GEMINI_API_KEY
vercel env add GEMINI_API_KEY
```

### Issue: Realtime Not Syncing

**Cause**: Realtime not enabled

**Solution**:
- In Supabase Dashboard → Database → Replication
- Enable Realtime for `bookmarks` table
- Or run SQL:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
  ```

### Issue: Build Fails on Vercel

**Cause**: TypeScript errors or missing dependencies

**Solution**:
```bash
# Test build locally
npm run build

# Fix any TypeScript errors
# Check package.json for correct versions

# Redeploy
vercel --prod
```

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to Vercel project → **Analytics**
2. View metrics:
   - Page views
   - Unique visitors
   - Top pages
   - Performance scores

### Supabase Logs

1. Go to Supabase project → **Logs**
2. Monitor:
   - API requests
   - Auth events
   - Database queries
   - Realtime connections

### Error Tracking (Optional)

Add Sentry for error monitoring:

```bash
npm install @sentry/nextjs

# Follow Sentry Next.js setup
npx @sentry/wizard@latest -i nextjs
```

## 🔒 Production Security Checklist

- [ ] RLS policies enabled and tested
- [ ] Service role key stored securely (env var only)
- [ ] OAuth credentials not committed to Git
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] Rate limiting implemented (TODO: future improvement)
- [ ] Input validation in place
- [ ] XSS prevention enabled

## 📈 Performance Optimization

### Enable Edge Runtime (Optional)

In API routes, add:

```typescript
export const runtime = 'edge';
```

### Image Optimization

Favicon URLs use external source. Consider:
- Caching favicons in Supabase Storage
- Using Vercel Image Optimization

### Database Optimization

If you have 1000+ bookmarks:
- Add pagination to bookmark list
- Implement infinite scroll
- Add database connection pooling

## 🎉 Launch Checklist

Before sharing your app:

- [ ] All features tested in production
- [ ] OAuth works for external users
- [ ] Error handling graceful
- [ ] Loading states appropriate
- [ ] Mobile responsive
- [ ] README updated with production URL
- [ ] Demo video/screenshots ready (optional)

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console for errors
4. Verify all environment variables
5. Test locally with same env vars

---

**Congratulations! Your Smart Bookmark App is now live! 🚀**

Share your deployed URL and show off your AI-powered bookmark manager!
