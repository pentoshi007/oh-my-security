import { getContentByDate as getSupabaseContent, getAllContent as getAllSupabaseContent, getContentArchive } from './supabase'
import type { DailyContent } from '../types/content'

// Convert Supabase data to our Content type
function convertSupabaseContent(supabaseData: any): DailyContent {
  return {
    ...supabaseData.content_data,
    // Ensure required fields are present
    attackType: supabaseData.content_data.attackType || supabaseData.attack_type,
    date: supabaseData.content_data.date || supabaseData.date
  }
}

// Fallback function to read from filesystem (for backward compatibility)
async function getContentFromFile(date: string): Promise<DailyContent | null> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const filePath = path.join(process.cwd(), 'content', `${date}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.log(`No file found for date ${date}:`, error)
    return null
  }
}

export async function getContentByDate(date: string): Promise<DailyContent | null> {
  try {
    // Try Supabase first
    const supabaseContent = await getSupabaseContent(date)
    if (supabaseContent) {
      return convertSupabaseContent(supabaseContent)
    }
    
    // Fallback to filesystem
    console.log(`Content not found in Supabase for ${date}, trying filesystem...`)
    return await getContentFromFile(date)
    
  } catch (error) {
    console.error('Error fetching content:', error)
    
    // Last resort: try filesystem
    return await getContentFromFile(date)
  }
}

export async function getAllContent(): Promise<DailyContent[]> {
  try {
    // Get from Supabase
    const supabaseContent = await getAllSupabaseContent()
    const convertedContent = supabaseContent.map(convertSupabaseContent)
    
    if (convertedContent.length > 0) {
      return convertedContent
    }
    
    // Fallback to filesystem if no Supabase content
    console.log('No content in Supabase, trying filesystem...')
    return await getAllContentFromFiles()
    
  } catch (error) {
    console.error('Error fetching all content:', error)
    
    // Fallback to filesystem
    return await getAllContentFromFiles()
  }
}

// Fallback function to read all content from filesystem
async function getAllContentFromFiles(): Promise<DailyContent[]> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const contentDir = path.join(process.cwd(), 'content')
    
    try {
      const files = await fs.readdir(contentDir)
      const jsonFiles = files.filter(file => file.endsWith('.json'))
      
      const contentPromises = jsonFiles.map(async (file) => {
        try {
          const filePath = path.join(contentDir, file)
          const fileContent = await fs.readFile(filePath, 'utf-8')
          return JSON.parse(fileContent)
        } catch (error) {
          console.error(`Error reading file ${file}:`, error)
          return null
        }
      })
      
      const contents = await Promise.all(contentPromises)
      return contents.filter(content => content !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
    } catch (dirError) {
      console.log('Content directory not found or empty')
      return []
    }
    
  } catch (error) {
    console.error('Error reading content from files:', error)
    return []
  }
}

export async function getAvailableDates(): Promise<string[]> {
  try {
    // Get from Supabase archive
    const archive = await getContentArchive()
    const dates = archive.map(item => item.date)
    
    if (dates.length > 0) {
      return dates
    }
    
    // Fallback to filesystem
    console.log('No dates in Supabase, trying filesystem...')
    return await getAvailableDatesFromFiles()
    
  } catch (error) {
    console.error('Error fetching available dates:', error)
    return await getAvailableDatesFromFiles()
  }
}

// Fallback function to get dates from filesystem
async function getAvailableDatesFromFiles(): Promise<string[]> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const contentDir = path.join(process.cwd(), 'content')
    
    try {
      const files = await fs.readdir(contentDir)
      const dates = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      
      return dates
      
    } catch (dirError) {
      console.log('Content directory not found')
      return []
    }
    
  } catch (error) {
    console.error('Error reading dates from files:', error)
    return []
  }
}

// Get the latest content (for homepage)
export async function getLatestContent(): Promise<DailyContent | null> {
  try {
    const allContent = await getAllContent()
    return allContent.length > 0 ? allContent[0] : null
  } catch (error) {
    console.error('Error fetching latest content:', error)
    return null
  }
}

// Legacy function for backward compatibility
export function getTodaysContent(): DailyContent | null {
  console.warn('getTodaysContent is deprecated, use getLatestContent() instead')
  // This will need to be handled differently since it's async now
  return null
} 