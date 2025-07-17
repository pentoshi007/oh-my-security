import { ExternalLink, Calendar, Info, ChevronsRight, AlertTriangle, Target, Shield, Code } from 'lucide-react'
import type { DailyContent } from '@/types/content'
import ContentTabs from './ContentTabs'

interface ContentDisplayProps {
  content: DailyContent
}

export default function ContentDisplay({ content }: ContentDisplayProps) {
  // Early return if content is not loaded
  if (!content || !content.content) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 sm:h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  const blueTeamTabs = content.content?.blueTeam ? [
    { title: 'About', content: content.content.blueTeam.about, icon: <Info /> },
    { title: 'How it Works', content: content.content.blueTeam.howItWorks, icon: <ChevronsRight /> },
    { title: 'Impact', content: content.content.blueTeam.impact, icon: <AlertTriangle /> }
  ] : []

  const redTeamTabs = content.content?.redTeam ? [
    { title: 'Objectives', content: content.content.redTeam.objectives, icon: <Target /> },
    { title: 'Methodology', content: content.content.redTeam.methodology, icon: <Shield /> },
    { title: 'Exploit Code', content: content.content.redTeam.exploitCode || 'No exploit code available.', icon: <Code /> }
  ] : []
  
  return (
    <div className="py-6 sm:py-8">
      {/* Header - Mobile Optimized */}
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tighter leading-tight mb-4">
          {content.attackType}
        </h1>
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{formatDate(content.date)}</span>
        </div>
      </div>
        
      {/* Article Reference - Mobile Optimized */}
      {content.article && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12 shadow-sm max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 tracking-tight">
            In the News
          </h2>
          <p className="text-gray-600 mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base">
            {content.article.summary}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
            <span className="font-medium text-gray-500">Source: {content.article.source}</span>
            <a 
              href={content.article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition-colors group py-2 px-3 -mx-3 rounded-lg hover:bg-blue-50"
            >
              <span>Read Full Article</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      )}

      {/* Interactive Content Tabs - Mobile Optimized */}
      <div className="glassmorphism rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
        <ContentTabs blueTeam={blueTeamTabs} redTeam={redTeamTabs} />
      </div>
    </div>
  )
} 