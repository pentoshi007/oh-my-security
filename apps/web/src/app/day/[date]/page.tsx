import ContentDisplay from '@/components/ContentDisplay'
import { getAllContent, getContentByDate } from '@/lib/content'
import { notFound } from 'next/navigation'
import ContentSection from '@/components/ContentSection'

interface DayPageProps {
  params: {
    date: string
  }
}

export async function generateStaticParams() {
  const allContent = getAllContent()
 
  return allContent.map((content) => ({
    date: content.date,
  }))
}

export default async function DayPage({ params }: DayPageProps) {
  const { date } = await params
  const content = getContentByDate(date)

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
        <ContentDisplay content={content} />
      </div>
    </ContentSection>
  )
} 