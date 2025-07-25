import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        // Check for secret to prevent unauthorized cache clearing
        const secret = request.nextUrl.searchParams.get('secret')

        if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
            return Response.json({ message: 'Invalid secret' }, { status: 401 })
        }

        // Clear all content-related cache tags
        revalidateTag('content')
        revalidateTag('latest-content')
        revalidateTag('archive')

        // Clear all paths
        revalidatePath('/', 'page')
        revalidatePath('/archive', 'page')
        revalidatePath('/day/[date]', 'page')

        console.log('✅ All cache cleared successfully')

        return Response.json({
            success: true,
            message: 'All cache cleared successfully',
            timestamp: new Date().toISOString(),
            clearedTags: ['content', 'latest-content', 'archive'],
            clearedPaths: ['/', '/archive', '/day/[date]']
        })
    } catch (err) {
        console.error('Cache clearing error:', err)
        return Response.json({
            message: 'Error clearing cache',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}