import ContentDisplay from '@/components/ContentDisplay'
import { getTodaysContent } from '@/lib/content'

export default async function HomePage() {
  const content = await getTodaysContent()

  return <ContentDisplay content={content} />
} 