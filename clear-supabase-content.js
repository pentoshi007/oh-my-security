#!/usr/bin/env node

/**
 * Clear Supabase Content Utility
 * 
 * This script clears all content from the Supabase daily_content table
 * to allow starting fresh from the first attack in the sequence.
 * 
 * Usage: node clear-supabase-content.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/web/.env.local' });

// Create Supabase admin client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- SUPABASE_URL:', !!supabaseUrl);
  console.error('- SUPABASE_SERVICE_KEY:', !!supabaseServiceKey);
  console.error('\nPlease check your apps/web/.env.local file');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function clearAllContent() {
  try {
    console.log('🧹 Starting Supabase content cleanup...');
    
    // Get current content count
    const { count: beforeCount, error: countError } = await supabaseAdmin
      .from('daily_content')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Failed to count existing content: ${countError.message}`);
    }
    
    console.log(`📊 Found ${beforeCount || 0} content entries to delete`);
    
    if (beforeCount === 0) {
      console.log('✅ No content found - database is already clean!');
      return;
    }
    
    // Delete all content
    const { error: deleteError } = await supabaseAdmin
      .from('daily_content')
      .delete()
      .gte('id', 0); // Delete all rows
    
    if (deleteError) {
      throw new Error(`Failed to delete content: ${deleteError.message}`);
    }
    
    console.log('✅ Successfully deleted all content from Supabase');
    
    // Verify deletion
    const { count: afterCount, error: verifyError } = await supabaseAdmin
      .from('daily_content')
      .select('*', { count: 'exact', head: true });
    
    if (verifyError) {
      console.warn('⚠️ Could not verify deletion, but delete operation completed');
    } else {
      console.log(`✅ Verification: ${afterCount || 0} entries remaining`);
    }
    
    console.log('\n🎯 Attack sequence will now start from the first attack:');
    console.log('   1. SQL Injection (sql-injection)');
    console.log('   2. Ransomware (ransomware)');
    console.log('   3. Phishing (phishing)');
    console.log('   ... and so on');
    
    console.log('\n📅 Next content generation will begin with SQL Injection');
    console.log('🕐 Cron job scheduled for 12:01 AM IST (6:31 PM UTC) daily');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

// Show confirmation prompt
console.log('⚠️  WARNING: This will permanently delete ALL content from Supabase!');
console.log('🔄 The attack sequence will restart from the first attack (SQL Injection)');
console.log('');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Are you sure you want to proceed? (type "yes" to confirm): ', (answer) => {
  rl.close();
  
  if (answer.toLowerCase() === 'yes') {
    clearAllContent();
  } else {
    console.log('❌ Operation cancelled');
    process.exit(0);
  }
});