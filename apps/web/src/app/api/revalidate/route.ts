import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    
    try {
        console.log('🔄 Starting revalidation process...');
        
        // Check for secret to prevent unauthorized revalidation
        const secret = request.nextUrl.searchParams.get('secret')

        if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
            console.log('❌ Invalid revalidation secret');
            return Response.json({ message: 'Invalid secret' }, { status: 401 })
        }

        // Get the date parameter
        const date = request.nextUrl.searchParams.get('date')
        console.log('📅 Revalidating for date:', date || 'all dates');

        // Revalidate all main pages with error handling
        const revalidationResults = [];
        
        try {
            revalidatePath('/', 'page')
            revalidationResults.push('/');
            console.log('✅ Revalidated: /');
        } catch (error) {
            console.error('❌ Failed to revalidate /:', error);
        }

        try {
            revalidatePath('/archive', 'page')
            revalidationResults.push('/archive');
            console.log('✅ Revalidated: /archive');
        } catch (error) {
            console.error('❌ Failed to revalidate /archive:', error);
        }

        try {
            revalidatePath('/day/[date]', 'page')
            revalidationResults.push('/day/[date]');
            console.log('✅ Revalidated: /day/[date]');
        } catch (error) {
            console.error('❌ Failed to revalidate /day/[date]:', error);
        }

        // Also revalidate specific date if provided
        if (date) {
            try {
                revalidatePath(`/day/${date}`, 'page')
                revalidationResults.push(`/day/${date}`);
                console.log(`✅ Revalidated: /day/${date}`);
            } catch (error) {
                console.error(`❌ Failed to revalidate /day/${date}:`, error);
            }
        }

        // Revalidate content-related tags
        const tagResults = [];
        
        try {
            revalidateTag('content')
            tagResults.push('content');
            console.log('✅ Revalidated tag: content');
        } catch (error) {
            console.error('❌ Failed to revalidate tag content:', error);
        }

        try {
            revalidateTag('latest-content')
            tagResults.push('latest-content');
            console.log('✅ Revalidated tag: latest-content');
        } catch (error) {
            console.error('❌ Failed to revalidate tag latest-content:', error);
        }

        try {
            revalidateTag('archive')
            tagResults.push('archive');
            console.log('✅ Revalidated tag: archive');
        } catch (error) {
            console.error('❌ Failed to revalidate tag archive:', error);
        }

        if (date) {
            try {
                revalidateTag(`content-${date}`)
                tagResults.push(`content-${date}`);
                console.log(`✅ Revalidated tag: content-${date}`);
            } catch (error) {
                console.error(`❌ Failed to revalidate tag content-${date}:`, error);
            }
        }

        const duration = Date.now() - startTime;
        console.log(`✅ Revalidation completed in ${duration}ms`);
        console.log(`📊 Results: ${revalidationResults.length} paths, ${tagResults.length} tags`);

        return Response.json({
            revalidated: true,
            timestamp: new Date().toISOString(),
            duration: `${duration}ms`,
            paths: revalidationResults,
            tags: tagResults,
            success: revalidationResults.length > 0 || tagResults.length > 0
        })
    } catch (err) {
        const duration = Date.now() - startTime;
        console.error('❌ Revalidation error:', err);
        return Response.json({
            message: 'Error revalidating',
            error: err instanceof Error ? err.message : 'Unknown error',
            duration: `${duration}ms`,
            success: false
        }, { status: 500 })
    }
}