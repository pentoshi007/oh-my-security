import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        // Check for secret to prevent unauthorized revalidation
        const secret = request.nextUrl.searchParams.get('secret')

        if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
            return Response.json({ message: 'Invalid secret' }, { status: 401 })
        }

        // Get the date parameter
        const date = request.nextUrl.searchParams.get('date')

        // Revalidate all main pages
        revalidatePath('/', 'page')
        revalidatePath('/archive', 'page')

        // Revalidate all day pages
        revalidatePath('/day/[date]', 'page')

        // Also revalidate specific date if provided
        if (date) {
            revalidatePath(`/day/${date}`, 'page')
        }

        // Revalidate content-related tags
        revalidateTag('content')
        revalidateTag('latest-content')
        revalidateTag('archive')

        if (date) {
            revalidateTag(`content-${date}`)
        }

        console.log(`✅ Revalidated pages: /, /archive, /day/[date]${date ? `, /day/${date}` : ''}`)

        return Response.json({
            revalidated: true,
            timestamp: new Date().toISOString(),
            paths: ['/', '/archive', '/day/[date]', date ? `/day/${date}` : null].filter(Boolean),
            tags: ['content', 'latest-content', 'archive', date ? `content-${date}` : null].filter(Boolean)
        })
    } catch (err) {
        console.error('Revalidation error:', err)
        return Response.json({
            message: 'Error revalidating',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}