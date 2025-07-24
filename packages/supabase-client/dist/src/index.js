import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
// Client for browser/server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
// Content management functions
export async function storeContentInSupabase(content) {
    // First, try to update existing content for the date
    const { data: existingData, error: selectError } = await supabaseAdmin
        .from('daily_content')
        .select('id, created_at')
        .eq('date', content.date)
        .single();
    if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new content
        throw new Error(`Failed to check existing content: ${selectError.message}`);
    }
    if (existingData) {
        // Update existing record, preserve original created_at
        const { error } = await supabaseAdmin
            .from('daily_content')
            .update({
            attack_type: content.attackType,
            content_data: content
            // Don't update created_at - keep original timestamp
        })
            .eq('date', content.date);
        if (error) {
            throw new Error(`Failed to update content: ${error.message}`);
        }
        console.log(`✅ Updated existing content for ${content.date}`);
    }
    else {
        // Insert new record with current timestamp
        const { error } = await supabaseAdmin
            .from('daily_content')
            .insert({
            date: content.date,
            attack_type: content.attackType,
            content_data: content,
            created_at: new Date().toISOString()
        });
        if (error) {
            throw new Error(`Failed to insert content: ${error.message}`);
        }
        console.log(`✅ Created new content for ${content.date}`);
    }
}
export async function getContentByDate(date) {
    // use public client; RLS allows read
    const { data, error } = await supabase
        .from('daily_content')
        .select('*')
        .eq('date', date)
        .single();
    if (error) {
        if (error.code === 'PGRST116') {
            return null; // No content found for this date
        }
        throw new Error(`Failed to fetch content: ${error.message}`);
    }
    return data;
}
export async function getAllContent(limit = 50) {
    // use public client
    const { data, error } = await supabase
        .from('daily_content')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit);
    if (error) {
        throw new Error(`Failed to fetch all content: ${error.message}`);
    }
    return data || [];
}
export async function getContentArchive() {
    // use public client
    const { data, error } = await supabase
        .from('daily_content')
        .select('date, attack_type')
        .order('date', { ascending: false });
    if (error) {
        throw new Error(`Failed to fetch archive: ${error.message}`);
    }
    return data || [];
}
//# sourceMappingURL=index.js.map