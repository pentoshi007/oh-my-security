#!/usr/bin/env node

// Migration script to upload existing content to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: './apps/web/.env.local' });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://pjgouvtbcjagpegszgfz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey || supabaseServiceKey === 'REPLACE_WITH_YOUR_ACTUAL_SERVICE_ROLE_KEY') {
  console.error('❌ Please set your SUPABASE_SERVICE_KEY in apps/web/.env.local');
  console.error('Go to Supabase Dashboard → Settings → API → Copy the service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateContent() {
  console.log('🚀 Starting content migration to Supabase...\n');
  
  const contentDir = path.join(__dirname, 'content');
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json') && file !== '.generation-history.json');
  
  console.log(`Found ${files.length} content files to migrate:`);
  files.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    try {
      console.log(`📄 Processing ${file}...`);
      
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const content = JSON.parse(fileContent);
      
      // Validate content structure
      if (!content.date || !content.attackType) {
        console.log(`⚠️  Skipping ${file}: Missing required fields`);
        continue;
      }
      
      // Check if content already exists for this date
      const { data: existingData, error: selectError } = await supabase
        .from('daily_content')
        .select('id, created_at')
        .eq('date', content.date)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.log(`❌ Error checking ${file}:`, selectError.message);
        errorCount++;
        continue;
      }

      if (existingData) {
        // Update existing record, preserve original created_at
        const { error } = await supabase
          .from('daily_content')
          .update({
            attack_type: content.attackType,
            content_data: content
          })
          .eq('date', content.date);

        if (error) {
          console.log(`❌ Error updating ${file}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Successfully updated ${file}`);
          successCount++;
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('daily_content')
          .insert({
            date: content.date,
            attack_type: content.attackType,
            content_data: content,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.log(`❌ Error inserting ${file}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Successfully migrated ${file}`);
          successCount++;
        }
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n🎉 Migration Summary:');
  console.log(`✅ Successfully migrated: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  
  if (successCount > 0) {
    console.log('\n🔍 Verifying migration...');
    const { data, error } = await supabase
      .from('daily_content')
      .select('date, attack_type')
      .order('date', { ascending: false });
    
    if (error) {
      console.log('❌ Error verifying migration:', error.message);
    } else {
      console.log(`\n📊 Database now contains ${data.length} entries:`);
      data.forEach(entry => {
        console.log(`  ${entry.date}: ${entry.attack_type}`);
      });
    }
  }
  
  console.log('\n🚀 Migration complete! Your content is now in Supabase.');
}

// Run the migration
migrateContent().catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
}); 