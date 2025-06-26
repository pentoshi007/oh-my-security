import ContentDisplay from '@/components/ContentDisplay'
import { getAllContent, getContentByDate } from '@/lib/content'
import { notFound } from 'next/navigation'

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

export default function DayPage({ params }: DayPageProps) {
  const content = getContentByDate(params.date)

  if (!content) {
    notFound()
  }

  return <ContentDisplay content={content} />
} 