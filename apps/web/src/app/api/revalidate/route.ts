import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        // Check for secret to prevent unauthorized revalidation
        const secret = request.nextUrl.searchParams.get('secret')

        if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
            return Response.json({ message: 'Invalid secret' }, { status: 401 })
        }

        // Revalidate all main pages
        revalidatePath('/')
        revalidatePath('/archive')
        revalidatePath('/day/[date]', 'page')

        // Also revalidate specific date if provided
        const date = request.nextUrl.searchParams.get('date')
        if (date) {
            revalidatePath(`/day/${date}`)
        }

        return Response.json({
            revalidated: true,
            timestamp: new Date().toISOString(),
            paths: ['/', '/archive', '/day/[date]', date ? `/day/${date}` : null].filter(Boolean)
        })
    } catch (err) {
        return Response.json({
            message: 'Error revalidating',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}