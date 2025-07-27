# 🔧 Environment Variables Setup Guide

## 🚨 **CRITICAL: Fix the 401 Authentication Error**

The revalidation error you're seeing is because the `REVALIDATE_SECRET` environment variable is missing or incorrect. Here's how to fix it:

## 📋 **Required Environment Variables**

### 1. **Supabase Database (Required)**
```bash
# Get these from https://supabase.com/dashboard
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 2. **News API (Required)**
```bash
# Get from https://newsapi.org/register (free tier: 100 requests/day)
NEWS_API_KEY=your_newsapi_key
```

### 3. **Google Gemini AI (Required)**
```bash
# Get from https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=your_google_gemini_api_key
```

### 4. **MongoDB Atlas (Required)**
```bash
# Get from https://mongodb.com/atlas
MONGODB_URI=your_mongodb_atlas_connection_string
```

### 5. **Cron Security (Required)**
```bash
# Generate with: openssl rand -base64 32
CRON_SECRET=your_random_secure_string
```

### 6. **Revalidation Secret (Required - Fixes 401 Error)**
```bash
# Generate with: openssl rand -base64 32
REVALIDATE_SECRET=your_random_secure_string
```

## 🚀 **Quick Setup Steps**

### Step 1: Generate Security Secrets
```bash
# Generate CRON_SECRET
openssl rand -base64 32

# Generate REVALIDATE_SECRET (can be same or different)
openssl rand -base64 32
```

### Step 2: Set Up APIs
1. **Supabase**: https://supabase.com → Create project → Settings → API
2. **NewsAPI**: https://newsapi.org/register → Get API key
3. **Google AI**: https://aistudio.google.com/app/apikey → Create API key
4. **MongoDB**: https://mongodb.com/atlas → Create cluster → Get connection string

### Step 3: Add to Environment
Create `apps/web/.env.local` with all variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# APIs
NEWS_API_KEY=your_newsapi_key
GOOGLE_API_KEY=your_google_gemini_api_key
MONGODB_URI=your_mongodb_atlas_connection_string

# Security
CRON_SECRET=your_generated_cron_secret
REVALIDATE_SECRET=your_generated_revalidate_secret
```

### Step 4: Deploy to Vercel
1. Add all environment variables to Vercel dashboard
2. Deploy the project
3. The 401 error should be resolved

## 🔍 **Testing the Fix**

After setting up the environment variables:

1. **Test locally**:
```bash
cd apps/web
npm run dev
```

2. **Test revalidation**:
```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_REVALIDATE_SECRET"
```

3. **Test cron job**:
```bash
curl -X GET "http://localhost:3000/api/cron" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## ✅ **Expected Results**

After fixing the environment variables:
- ✅ No more 401 authentication errors
- ✅ Revalidation works properly
- ✅ Cron job runs successfully
- ✅ Content generation works
- ✅ Database storage works
- ✅ UI blur issues fixed

## 🆘 **Troubleshooting**

### If you still get 401 errors:
1. Check that `REVALIDATE_SECRET` is set correctly
2. Verify the secret matches in both local and Vercel environments
3. Check that the cron job is using the correct `CRON_SECRET`

### If content doesn't update:
1. Verify `REVALIDATE_SECRET` is being used in the revalidation API
2. Check that all API keys are valid
3. Test the revalidation endpoint manually

## 📊 **Current Status**

Based on your error message:
- ❌ **Revalidation failing**: Missing `REVALIDATE_SECRET`
- ❌ **Authentication error**: 401 due to missing secret
- ✅ **Content generation**: Working (content was stored)
- ✅ **Database**: Working (Supabase integration successful)

**Fix the `REVALIDATE_SECRET` and the 401 error will be resolved!**