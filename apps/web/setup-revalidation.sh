#!/bin/bash

# Setup script for revalidation environment variables
echo "🔧 Setting up revalidation environment variables..."

# Generate REVALIDATE_SECRET if not already set
if [ -z "$REVALIDATE_SECRET" ]; then
    echo "📋 Generating REVALIDATE_SECRET..."
    REVALIDATE_SECRET=$(openssl rand -base64 32)
    echo "REVALIDATE_SECRET=$REVALIDATE_SECRET"
    
    # Add to .env file if it exists
    if [ -f ".env" ]; then
        echo "REVALIDATE_SECRET=$REVALIDATE_SECRET" >> .env
        echo "✅ Added REVALIDATE_SECRET to .env file"
    else
        echo "📝 Create a .env file and add: REVALIDATE_SECRET=$REVALIDATE_SECRET"
    fi
    
    # Export for current session
    export REVALIDATE_SECRET="$REVALIDATE_SECRET"
    echo "✅ Exported REVALIDATE_SECRET for current session"
else
    echo "✅ REVALIDATE_SECRET is already set"
fi

# Test the revalidation endpoint
echo ""
echo "🧪 Testing revalidation endpoint..."
if command -v node &> /dev/null; then
    node test-revalidate.js
else
    echo "❌ Node.js not found. Please install Node.js to test revalidation."
fi

echo ""
echo "📋 Environment Variables Summary:"
echo "REVALIDATE_SECRET: ${REVALIDATE_SECRET:+SET}"
echo "VERCEL_URL: ${VERCEL_URL:-Not set}"
echo "NODE_ENV: ${NODE_ENV:-Not set}"

echo ""
echo "💡 Next Steps:"
echo "1. If deploying to Vercel, add REVALIDATE_SECRET to your Vercel environment variables"
echo "2. Test the cron job: node test-cron.js"
echo "3. Test revalidation: node test-revalidate.js"
echo "4. Check the troubleshooting guide: REVALIDATION_TROUBLESHOOTING.md"