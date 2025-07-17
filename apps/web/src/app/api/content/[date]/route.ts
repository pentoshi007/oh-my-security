import { NextRequest } from 'next/server'
import { getContentByDate } from '../../../../lib/content'

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return Response.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }
    
    const content = await getContentByDate(date)
    
    if (!content) {
      return Response.json(
        { error: 'Content not found for this date' },
        { status: 404 }
      )
    }
    
    return Response.json({
      success: true,
      data: content,
      source: 'supabase'
    })
    
  } catch (error) {
    console.error('Error fetching content:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 