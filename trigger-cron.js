#!/usr/bin/env node

/**
 * Manual Cron Trigger Utility
 * 
 * This script manually triggers the cron job endpoint to test content generation
 * without waiting for the scheduled time.
 * 
 * Usage: node trigger-cron.js [URL]
 */

require('dotenv').config({ path: 'apps/web/.env.local' });

const url = process.argv[2] || 'http://localhost:3000';
const cronSecret = process.env.CRON_SECRET;

if (!cronSecret) {
  console.error('❌ CRON_SECRET not found in environment variables');
  console.error('Please check your apps/web/.env.local file');
  process.exit(1);
}

async function triggerCron() {
  try {
    console.log('🚀 Triggering cron job manually...');
    console.log(`📍 Target URL: ${url}/api/cron`);
    console.log(`🔐 Using CRON_SECRET: ${cronSecret.substring(0, 8)}...`);
    
    const startTime = Date.now();
    
    const response = await fetch(`${url}/api/cron`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'User-Agent': 'Manual-Trigger/1.0'
      }
    });
    
    const duration = Date.now() - startTime;
    const responseText = await response.text();
    
    console.log(`⏱️ Response time: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Cron job executed successfully!');
        console.log('📄 Response:', JSON.stringify(data, null, 2));
        
        if (data.attackType) {
          console.log(`\n🎯 Generated content for: ${data.attackType}`);
          console.log(`📅 Date: ${data.date}`);
          console.log(`📂 Category: ${data.category}`);
          console.log(`⚡ Difficulty: ${data.difficulty}`);
        }
      } catch (parseError) {
        console.log('✅ Cron job executed successfully!');
        console.log('📄 Response (raw):', responseText);
      }
    } else {
      console.error('❌ Cron job failed!');
      console.error('📄 Error response:', responseText);
    }
    
  } catch (error) {
    console.error('❌ Failed to trigger cron job:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure your development server is running:');
      console.error('   cd apps/web && npm run dev');
    }
  }
}

// Display current time in both UTC and IST
const now = new Date();
const istTime = now.toLocaleString('en-IN', { 
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

const utcTime = now.toISOString();

console.log('🕐 Current time:');
console.log(`   IST: ${istTime}`);
console.log(`   UTC: ${utcTime}`);
console.log('');

triggerCron();