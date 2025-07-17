import { NextRequest } from 'next/server'
import { getAvailableDates, getAllContent } from '../../../lib/content'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const detailed = searchParams.get('detailed') === 'true'
    
    if (detailed) {
      // Return full content list with metadata
      const allContent = await getAllContent()
      const archive = allContent.map(content => ({
        date: content.date,
        attackType: content.attackType,
        metadata: content.metadata || {}
      }))
      
      return Response.json({
        success: true,
        count: archive.length,
        data: archive,
        source: 'supabase'
      })
    } else {
      // Return just dates
      const dates = await getAvailableDates()
      
      return Response.json({
        success: true,
        count: dates.length,
        data: dates,
        source: 'supabase'
      })
    }
    
  } catch (error) {
    console.error('Error fetching archive:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 