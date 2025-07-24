import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

// Public client for client-side operations (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Database schema types
export interface DailyContent {
  id: number
  date: string
  attack_type: string
  content_data: any
  created_at: string
}

// Content management functions
export async function storeContentInSupabase(content: any): Promise<void> {
  const { data: existingData, error: selectError } = await supabaseAdmin
    .from('daily_content')
    .select('id, created_at')
    .eq('date', content.date)
    .single()

  if (selectError && selectError.code !== 'PGRST116') {
    throw new Error(`Failed to check for existing content: ${selectError.message}`)
  }

  if (existingData) {
    // Update existing record, preserve original created_at
    const { error } = await supabaseAdmin
      .from('daily_content')
      .update({
        attack_type: content.attackType,
        content_data: content
      })
      .eq('id', existingData.id)

    if (error) throw new Error(`Failed to update content: ${error.message}`)
    console.log(`✅ Updated existing content for ${content.date}`)
  } else {
    // Insert new record with current timestamp
    const { error } = await supabaseAdmin
      .from('daily_content')
      .insert({
        date: content.date,
        attack_type: content.attackType,
        content_data: content
      })

    if (error) throw new Error(`Failed to store content: ${error.message}`)
    console.log(`✅ Stored new content for ${content.date}`)
  }
}

export async function getContentByDate(date: string): Promise<DailyContent | null> {
  const { data, error } = await supabase
    .from('daily_content')
    .select('*')
    .eq('date', date)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // No content found for this date
    }
    throw new Error(`Failed to fetch content: ${error.message}`)
  }

  return data
}

export async function getAllContent(limit = 50): Promise<DailyContent[]> {
  const { data, error } = await supabase
    .from('daily_content')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch all content: ${error.message}`)

  return data || []
}

export async function getContentArchive(): Promise<{ date: string; attack_type: string }[]> {
  const { data, error } = await supabase
    .from('daily_content')
    .select('date, attack_type')
    .order('date', { ascending: false })

  if (error) throw new Error(`Failed to fetch content archive: ${error.message}`)

  return data || []
}
