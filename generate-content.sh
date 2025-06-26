#!/bin/bash

# Oh-My-Security Content Generator
# This script ensures the correct Node.js version is used

export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

echo "🛡️  Oh-My-Security Content Generator"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

cd packages/generator

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create packages/generator/.env with:"
    echo "NEWS_API_KEY=your_newsapi_key_here"
    echo "HF_TOKEN=your_huggingface_token_here"
    echo ""
    echo "Get your API keys from:"
    echo "• NewsAPI: https://newsapi.org/register"
    echo "• Hugging Face: https://huggingface.co/settings/tokens"
    exit 1
fi

npm start
