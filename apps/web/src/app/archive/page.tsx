import { getAllContent } from '../../lib/content'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Content Archive
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse through our comprehensive collection of cybersecurity content. 
            Each entry provides detailed blue team and red team perspectives on various attack methodologies.
          </p>
        </div>

        {error ? (
          <div className="text-center">
            <div className="glassmorphic p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-red-400 mb-4">Error Loading Archive</h2>
              <p className="text-gray-300">{error}</p>
            </div>
          </div>
        ) : archiveContent.length === 0 ? (
          <div className="text-center">
            <div className="glassmorphic p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-300 mb-4">No Content Available</h2>
              <p className="text-gray-400">Content archive is currently empty. Check back later!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="glassmorphic px-6 py-3 inline-block">
                <span className="text-2xl font-bold text-blue-400">{archiveContent.length}</span>
                <span className="text-gray-300 ml-2">Total Entries</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveContent.map((content) => (
                <Link 
                  key={content.date} 
                  href={`/day/${content.date}`}
                  className="glassmorphic p-6 hover:scale-105 transition-all duration-300 block group"
                >
                  <div className="mb-4">
                    <div className="text-sm text-blue-400 font-semibold mb-2">
                      {new Date(content.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {content.attackType}
                    </h3>
                  </div>
                  
                  {content.metadata && (
                    <div className="space-y-2 text-sm">
                      {content.metadata.difficulty && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Difficulty:</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            content.metadata.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                            content.metadata.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {content.metadata.difficulty}
                          </span>
                        </div>
                      )}
                      
                      {content.metadata.category && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-purple-400">{content.metadata.category}</span>
                        </div>
                      )}
                      
                      {content.metadata.impact && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Impact:</span>
                          <span className="text-orange-400">{content.metadata.impact}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-blue-400 text-sm group-hover:text-blue-300 transition-colors">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 glassmorphic px-6 py-3 hover:scale-105 transition-all duration-300"
          >
            <span className="text-white">← Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 