#!/bin/bash

# Vercel Environment Setup Script
# This script sets up environment variables in Vercel using the CLI

echo "🚀 Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel first:"
    echo "vercel login"
    exit 1
fi

# Generate secrets if not provided
REVALIDATE_SECRET=${REVALIDATE_SECRET:-$(openssl rand -base64 32)}
CRON_SECRET=${CRON_SECRET:-$(openssl rand -base64 32)}

echo "📋 Generated secrets:"
echo "REVALIDATE_SECRET: $REVALIDATE_SECRET"
echo "CRON_SECRET: $CRON_SECRET"

echo ""
echo "🔧 Setting up environment variables in Vercel..."

# Set environment variables using Vercel CLI
echo "Setting REVALIDATE_SECRET..."
vercel env add REVALIDATE_SECRET production <<< "$REVALIDATE_SECRET"

echo "Setting CRON_SECRET..."
vercel env add CRON_SECRET production <<< "$CRON_SECRET"

echo ""
echo "✅ Environment variables set successfully!"
echo ""
echo "📋 Summary:"
echo "REVALIDATE_SECRET: $REVALIDATE_SECRET"
echo "CRON_SECRET: $CRON_SECRET"
echo ""
echo "🔄 Next steps:"
echo "1. Deploy your project: vercel --prod"
echo "2. Test revalidation: curl -X POST 'https://your-domain.vercel.app/api/revalidate?secret=$REVALIDATE_SECRET&date=2024-01-01'"
echo "3. Test cron job: curl -X GET 'https://your-domain.vercel.app/api/cron' -H 'Authorization: Bearer $CRON_SECRET'"
echo ""
echo "💡 You can also set these manually in the Vercel dashboard:"
echo "   Settings → Environment Variables"