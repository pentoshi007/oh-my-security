# Oh-My-Security Deployment Guide

## Environment Variables

Set up the following environment variables in your deployment platform:

### Required Variables

```bash
# News API (get from https://newsapi.org/)
NEWS_API_KEY=your_newsapi_key_here

# Google Gemini AI API (get from https://aistudio.google.com/app/apikey)
GOOGLE_API_KEY=your_google_api_key_here

# MongoDB Connection (replace with your actual MongoDB URI)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<app_name>

# Cron job security (generate a random secret)
CRON_SECRET=your_random_secret_here
```

### Optional Variables

```bash
# Custom date for testing (YYYY-MM-DD format)
CUSTOM_DATE=2025-06-27

# Force attack discovery during testing
FORCE_ATTACK_DISCOVERY=true
```

## Vercel Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy the project
vercel --prod
```

### 2. Set Environment Variables

```bash
# Set required environment variables
vercel env add NEWS_API_KEY
vercel env add GOOGLE_API_KEY
vercel env add MONGODB_URI
vercel env add CRON_SECRET

# Or use the Vercel dashboard at https://vercel.com/your-team/your-project/settings/environment-variables
```

### 3. Configure Cron Jobs

The `vercel.json` file includes two cron jobs:

1. **Daily Content Generation**: Runs at 12:00 PM UTC daily

   - URL: `/api/cron?secret=${CRON_SECRET}`
   - Schedule: `0 12 * * *`

2. **Weekly Attack Discovery**: Runs at 8:00 AM UTC on Sundays
   - URL: `/api/cron?secret=${CRON_SECRET}&discover=true`
   - Schedule: `0 8 * * 0`

## Manual Triggers

### Generate Content Manually

```bash
curl "https://your-domain.vercel.app/api/cron?secret=YOUR_CRON_SECRET"
```

### Force Attack Discovery

```bash
curl "https://your-domain.vercel.app/api/cron?secret=YOUR_CRON_SECRET&discover=true"
```

## MongoDB Setup

### 1. Database Structure

The system uses MongoDB to store:

- **subscribers**: Email subscriptions with preferences
- **attack_history**: Generated content history and attack usage tracking

### 2. Collections

#### Subscribers Collection

```javascript
{
  _id: ObjectId,
  email: String,
  subscribedAt: Date,
  active: Boolean,
  source: String,
  preferences: {
    dailyDigest: Boolean,
    weeklyNewsletter: Boolean,
    specialAlerts: Boolean
  }
}
```

#### Attack History (automatically managed)

```javascript
{
  recentAttackIds: [String],
  lastGenerated: String,
  generationCount: Number
}
```

## Features

### 🔄 Automatic Attack Discovery

- Scans cybersecurity news for new attack methodologies
- Adds discovered attacks to the dynamic database
- Runs weekly to keep content fresh

### 📚 Methodology-Driven Content

- Systematically covers all attack types
- Avoids duplicate content for 30+ days
- Restarts cycle when all attacks are covered

### 📧 MongoDB Integration

- Stores subscribers in MongoDB instead of CSV files
- Scalable and reliable subscription management
- Ready for email notification features

### ⏰ Automated Scheduling

- Daily content generation at 12:00 PM UTC
- Weekly attack discovery at 8:00 AM UTC Sunday
- Fault-tolerant with comprehensive error logging

## Monitoring

### Check Cron Job Status

Visit your Vercel dashboard:

1. Go to Functions tab
2. Check `/api/cron` function logs
3. Monitor execution times and errors

### View Generated Content

Check the `/content` directory for daily JSON files:

- Format: `YYYY-MM-DD.json`
- Contains attack methodology and educational content
- Includes metadata about news sources used

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**

   - Check Vercel environment variables are set
   - Verify variable names match exactly

2. **API Rate Limits**

   - NewsAPI has rate limits on free tier
   - Consider upgrading for production use

3. **MongoDB Connection Issues**

   - Verify connection string is correct
   - Check MongoDB Atlas network access settings

4. **Cron Job Not Running**
   - Verify CRON_SECRET is set
   - Check Vercel cron job configuration
   - Monitor function logs for errors

### Debug Mode

Enable verbose logging by setting:

```bash
NODE_ENV=development
```

This will include stack traces in error responses.

## Scaling Considerations

### For High Traffic

1. **MongoDB**: Use MongoDB Atlas Pro tier
2. **NewsAPI**: Upgrade to paid plan for higher limits
3. **Vercel**: Consider Pro plan for better performance
4. **CDN**: Use Vercel's built-in CDN for static content

### For Multiple Languages

1. Add language parameter to content generation
2. Modify database schema to include language
3. Update cron jobs for different timezones
4. Localize attack methodology database
 