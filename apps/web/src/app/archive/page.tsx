import { getAllContent } from '@/lib/content'
import Link from 'next/link'
import { Calendar, ChevronsRight } from 'lucide-react'

export default async function ArchivePage() {
  const allContent = getAllContent()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Content Archive
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Browse through all previously generated cybersecurity threat analyses.
        </p>
      </div>

      {allContent.length > 0 ? (
        <div className="space-y-6">
          {allContent.map((content) => (
            <Link
              href={`/day/${content.date}#content`}
              key={content.date}
              className="block p-6 glassmorphism rounded-2xl hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(content.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                    {content.attackType}
                  </h2>
                  <p className="text-gray-600 mt-1 truncate">{content.article.title}</p>
                </div>
                <ChevronsRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No content has been generated yet. Run the generator to see content here.
        </p>
      )}
    </div>
  )
} 