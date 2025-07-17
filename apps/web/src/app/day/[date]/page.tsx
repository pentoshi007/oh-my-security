import ContentDisplay from '@/components/ContentDisplay'
import { getAllContent, getContentByDate } from '@/lib/content'
import { notFound } from 'next/navigation'
import ContentSection from '@/components/ContentSection'
import Link from 'next/link'

interface DayPageProps {
  params: Promise<{
    date: string
  }>
}

export async function generateStaticParams() {
  try {
    const allContent = await getAllContent()
   
    return allContent.map((content) => ({
      date: content.date,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function DayPage({ params }: DayPageProps) {
  const { date } = await params
  const content = await getContentByDate(date)

  if (!content) {
    notFound()
  }

  return (
    <ContentSection 
      id="content" 
      className="py-16 px-6"
      title={content.attackType}
      subtitle={`Security analysis for ${new Date(content.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Navigation Button */}
        <div className="mb-8">
          <Link 
            href="/archive" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-300 hover:scale-105 border border-primary/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Archive
          </Link>
        </div>
        
        <ContentDisplay content={content} />
      </div>
    </ContentSection>
  )
} 