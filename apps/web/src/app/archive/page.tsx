import { getAllContent } from '../../lib/content'
import Link from 'next/link'
import ArchiveClient from './ArchiveClient'

export default async function ArchivePage() {
  let archiveContent: any[] = []
  let error: string | null = null

  try {
    const allContent = await getAllContent()
    archiveContent = allContent.map(content => ({
      date: content.date,
      attackType: content.attackType,
      metadata: content.metadata || {}
    }))
  } catch (err) {
    console.error('Error loading archive:', err)
    error = 'Failed to load archive content'
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Back to Home Button - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105 border border-gray-200 text-sm sm:text-base font-medium min-h-[48px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Content Archive
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse through all previously generated cybersecurity threat analyses.
          </p>
        </div>

        {error ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-semibold text-red-600 mb-4">Error Loading Archive</h2>
              <p className="text-gray-700 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        ) : archiveContent.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">No Content Available</h2>
              <p className="text-gray-500 text-sm sm:text-base">Content archive is currently empty. Check back later!</p>
            </div>
          </div>
        ) : (
          <ArchiveClient archiveContent={archiveContent} />
        )}
      </div>
    </div>
  )
} 