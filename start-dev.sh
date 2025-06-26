#!/bin/bash

# Oh-My-Security Development Server Starter
# This script ensures the correct Node.js version is used

export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

echo "🛡️  Starting Oh-My-Security Development Server"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

cd apps/web
npm run dev
