import { ExternalLink, Calendar, Code, Info, ChevronsRight, AlertTriangle, Shield, Target } from 'lucide-react'
import type { DailyContent } from '@/types/content'
import ContentTabs from './ContentTabs'

interface ContentDisplayProps {
  content: DailyContent
}

export default function ContentDisplay({ content }: ContentDisplayProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const blueTeamTabs = [
    { title: 'About', content: content.content.blueTeam.about, icon: <Info /> },
    { title: 'How it Works', content: content.content.blueTeam.howItWorks, icon: <ChevronsRight /> },
    { title: 'Impact', content: content.content.blueTeam.impact, icon: <AlertTriangle /> }
  ];

  const redTeamTabs = [
    { title: 'Objectives', content: content.content.redTeam.objectives, icon: <Target /> },
    { title: 'Methodology', content: content.content.redTeam.methodology, icon: <Shield /> },
    { title: 'Exploit Code', content: content.content.redTeam.exploitCode || 'No exploit code available.', icon: <Code /> }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-2 text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{formatDate(content.date)}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          {content.attackType}
        </h1>
      </div>
        
      {/* Article Reference */}
      <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-4 sm:p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          📰
          <span>In the News</span>
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">{content.article.summary}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-500">Source: {content.article.source}</span>
          <a 
            href={content.article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
          >
            <span>Read full article</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Interactive Content Tabs */}
      <ContentTabs blueTeam={blueTeamTabs} redTeam={redTeamTabs} />
    </div>
  )
} 