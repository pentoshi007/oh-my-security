#!/usr/bin/env node

/**
 * Test script to verify revalidation endpoint
 * Usage: node test-revalidate.js
 */

const https = require('https');
const http = require('http');

async function testRevalidation() {
  const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  
  if (!revalidateSecret) {
    console.error('❌ REVALIDATE_SECRET environment variable is required');
    console.log('💡 Set REVALIDATE_SECRET in your environment variables');
    process.exit(1);
  }

  console.log('🧪 Testing revalidation endpoint...');
  console.log(`📍 URL: ${baseUrl}/api/revalidate`);
  console.log(`🔑 Using secret: ${revalidateSecret.substring(0, 10)}...`);

  const url = new URL('/api/revalidate', baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
  url.searchParams.set('secret', revalidateSecret);
  url.searchParams.set('date', new Date().toISOString().split('T')[0]); // Today's date
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'test-revalidate-script/1.0'
    },
    timeout: 30000 // 30 seconds timeout
  };

  const client = url.protocol === 'https:' ? https : http;

  const req = client.request(url, options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`\n📊 Response Status: ${res.statusCode}`);
        console.log('📋 Response Data:', JSON.stringify(response, null, 2));
        
        if (res.statusCode === 200 && response.revalidated) {
          console.log('\n✅ Revalidation successful!');
          console.log(`⏱️ Duration: ${response.duration}`);
          console.log(`📁 Paths revalidated: ${response.paths.length}`);
          console.log(`🏷️ Tags revalidated: ${response.tags.length}`);
        } else {
          console.log('\n❌ Revalidation failed');
          if (response.debug) {
            console.log('🔍 Debug info:', response.debug);
          }
        }
      } catch (error) {
        console.error('❌ Failed to parse response:', error);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });

  req.on('timeout', () => {
    console.error('❌ Request timed out after 30 seconds');
    req.destroy();
  });

  req.end();
}

// Run the test
testRevalidation().catch(console.error);