#!/usr/bin/env node

/**
 * Test script to manually trigger the cron job
 * Usage: node test-cron.js
 */

const https = require('https');
const http = require('http');

async function testCronJob() {
  const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.error('❌ CRON_SECRET environment variable is required');
    process.exit(1);
  }

  console.log('🧪 Testing cron job...');
  console.log(`📍 URL: ${baseUrl}/api/cron`);
  console.log(`🔑 Using secret: ${cronSecret.substring(0, 10)}...`);

  const url = new URL('/api/cron', baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${cronSecret}`,
      'Content-Type': 'application/json',
      'User-Agent': 'test-cron-script/1.0'
    },
    timeout: 300000 // 5 minutes timeout
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
        
        if (res.statusCode === 200 && response.success) {
          console.log('\n✅ Cron job executed successfully!');
          console.log(`📅 Generated content for: ${response.date}`);
          console.log(`🎯 Attack type: ${response.attackType}`);
          console.log(`⏱️ Duration: ${response.duration}`);
        } else {
          console.log('\n❌ Cron job failed or returned error');
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
    console.error('❌ Request timed out after 5 minutes');
    req.destroy();
  });

  req.end();
}

// Run the test
testCronJob().catch(console.error);