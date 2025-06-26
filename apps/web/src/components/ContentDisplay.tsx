import { ExternalLink, Calendar, Info, ChevronsRight, AlertTriangle, Target, Shield, Code } from 'lucide-react'
import type { DailyContent } from '@/types/content'
import ContentTabs from './ContentTabs'

interface ContentDisplayProps {
  content: DailyContent
}

export default function ContentDisplay({ content }: ContentDisplayProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  const blueTeamTabs = content.content.blueTeam ? [
    { title: 'About', content: content.content.blueTeam.about, icon: <Info /> },
    { title: 'How it Works', content: content.content.blueTeam.howItWorks, icon: <ChevronsRight /> },
    { title: 'Impact', content: content.content.blueTeam.impact, icon: <AlertTriangle /> }
  ] : []

  const redTeamTabs = content.content.redTeam ? [
    { title: 'Objectives', content: content.content.redTeam.objectives, icon: <Target /> },
    { title: 'Methodology', content: content.content.redTeam.methodology, icon: <Shield /> },
    { title: 'Exploit Code', content: content.content.redTeam.exploitCode || 'No exploit code available.', icon: <Code /> }
  ] : []
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tighter leading-tight">
          {content.attackType}
        </h1>
        <div className="flex items-center justify-center space-x-2 text-gray-500 mt-4">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{formatDate(content.date)}</span>
        </div>
      </div>
        
      {/* Article Reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-12 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">
          In the News
        </h2>
        <p className="text-gray-600 mb-5 leading-relaxed">{content.article.summary}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-500">Source: {content.article.source}</span>
          <a 
            href={content.article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
          >
            <span>Read Full Article</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Interactive Content Tabs */}
      <ContentTabs blueTeam={blueTeamTabs} redTeam={redTeamTabs} />
    </div>
  )
} 