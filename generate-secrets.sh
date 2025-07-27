#!/bin/bash

echo "🔐 Generating Security Secrets for Oh-My-Security"
echo "=================================================="
echo ""

# Generate CRON_SECRET
echo "📋 CRON_SECRET (for cron job authentication):"
CRON_SECRET=$(openssl rand -base64 32)
echo "CRON_SECRET=$CRON_SECRET"
echo ""

# Generate REVALIDATE_SECRET
echo "📋 REVALIDATE_SECRET (for page revalidation):"
REVALIDATE_SECRET=$(openssl rand -base64 32)
echo "REVALIDATE_SECRET=$REVALIDATE_SECRET"
echo ""

echo "✅ Copy these values to your environment variables:"
echo ""
echo "# Add to apps/web/.env.local and Vercel dashboard:"
echo "CRON_SECRET=$CRON_SECRET"
echo "REVALIDATE_SECRET=$REVALIDATE_SECRET"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "📁 Local file: apps/web/.env.local"
echo ""
echo "⚠️  Keep these secrets secure and don't share them publicly!"