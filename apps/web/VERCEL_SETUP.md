# Vercel Environment Setup Guide

## Overview
This guide explains how to properly configure your application in the Vercel environment to ensure the cron jobs and revalidation work correctly.

## Environment Variables Required

### 1. **REVALIDATE_SECRET** (Required)
**Purpose**: Authenticates revalidation requests to prevent unauthorized cache invalidation
**Value**: `NCWpkCQtMVRi2/Gip1fTPlzyptKEz3O9sMANW/CbZ7s=`

### 2. **CRON_SECRET** (Required)
**Purpose**: Authenticates cron job requests to prevent unauthorized execution
**Value**: `gvvBIAjmvVeOCtCEvLp5IwXFZ308qI+5BGWEqZdarq0=`

### 3. **VERCEL_URL** (Auto-set by Vercel)
**Purpose**: Used for internal API calls within the Vercel environment
**Value**: Automatically set by Vercel (e.g., `your-project.vercel.app`)

## Setting Up Environment Variables in Vercel

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Select your project

### Step 2: Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Add each variable:

#### For Production Environment:
```
Name: REVALIDATE_SECRET
Value: NCWpkCQtMVRi2/Gip1fTPlzyptKEz3O9sMANW/CbZ7s=
Environment: Production

Name: CRON_SECRET
Value: gvvBIAjmvVeOCtCEvLp5IwXFZ308qI+5BGWEqZdarq0=
Environment: Production
```

#### For Preview Environment (Optional):
```
Name: REVALIDATE_SECRET
Value: NCWpkCQtMVRi2/Gip1fTPlzyptKEz3O9sMANW/CbZ7s=
Environment: Preview

Name: CRON_SECRET
Value: gvvBIAjmvVeOCtCEvLp5IwXFZ308qI+5BGWEqZdarq0=
Environment: Preview
```

### Step 3: Deploy
1. Commit and push your changes to trigger a new deployment
2. Vercel will automatically use the new environment variables

## Verifying the Setup

### 1. Check Environment Variables
After deployment, you can verify the environment variables are set by checking the function logs:

```bash
# In Vercel dashboard, go to Functions tab
# Look for logs that show environment variables are loaded
```

### 2. Test Revalidation (Production)
You can test the revalidation endpoint on your live site:

```bash
curl -X POST "https://your-domain.vercel.app/api/revalidate?secret=NCWpkCQtMVRi2/Gip1fTPlzyptKEz3O9sMANW/CbZ7s=&date=2024-01-01"
```

### 3. Test Cron Job (Production)
Test the cron job endpoint:

```bash
curl -X GET "https://your-domain.vercel.app/api/cron" \
  -H "Authorization: Bearer gvvBIAjmvVeOCtCEvLp5IwXFZ308qI+5BGWEqZdarq0="
```

## Cron Job Configuration

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "30 18 * * *"
    }
  ]
}
```

This runs daily at 6:30 PM UTC.

## How It Works in Vercel

### 1. **Cron Job Execution**
- Vercel automatically triggers the cron job at the scheduled time
- The job generates new content and stores it in Supabase
- After content generation, it calls the revalidation endpoint

### 2. **Revalidation Process**
- The cron job calls `/api/revalidate` with the secret
- This invalidates the cache for all pages
- New content becomes visible immediately

### 3. **URL Construction**
In production, the revalidation URL is constructed as:
```
https://your-domain.vercel.app/api/revalidate?secret=REVALIDATE_SECRET&date=2024-01-01
```

## Troubleshooting

### Issue: 401 Unauthorized
**Cause**: Missing or incorrect `REVALIDATE_SECRET`
**Solution**: Verify the environment variable is set correctly in Vercel

### Issue: Cron Job Fails
**Cause**: Missing or incorrect `CRON_SECRET`
**Solution**: Verify the environment variable is set correctly in Vercel

### Issue: Revalidation Not Working
**Cause**: Network issues or timeout
**Solution**: Check the function logs in Vercel dashboard

### Issue: Content Not Updating
**Cause**: Cache not being invalidated properly
**Solution**: 
1. Check revalidation logs
2. Verify the secret is being passed correctly
3. Test the revalidation endpoint manually

## Monitoring

### 1. **Function Logs**
- Go to Vercel Dashboard → Your Project → Functions
- Check logs for `/api/cron` and `/api/revalidate`

### 2. **Environment Variables**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Verify all variables are set correctly

### 3. **Cron Job Status**
- Check the Functions tab for cron job execution logs
- Look for success/failure messages

## Security Notes

1. **Keep secrets secure**: Don't commit secrets to your repository
2. **Rotate secrets**: Consider rotating secrets periodically
3. **Monitor access**: Check function logs for unauthorized access attempts

## Quick Commands

```bash
# Generate new secrets (if needed)
openssl rand -base64 32

# Test revalidation locally
node test-revalidate.js

# Test cron job locally
node test-cron.js

# Check environment variables
echo "REVALIDATE_SECRET: ${REVALIDATE_SECRET:+SET}"
echo "CRON_SECRET: ${CRON_SECRET:+SET}"
```

## Support

If you encounter issues:
1. Check the function logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Test endpoints manually using curl
4. Review the troubleshooting guide: `REVALIDATION_TROUBLESHOOTING.md`