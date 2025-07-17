'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronDown } from 'lucide-react'

interface ArchiveContent {
  date: string
  attackType: string
  metadata?: {
    category?: string
    difficulty?: string
    impact?: string
  }
}

interface ArchiveClientProps {
  archiveContent: ArchiveContent[]
}

export default function ArchiveClient({ archiveContent }: ArchiveClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>()
    archiveContent.forEach(content => {
      if (content.metadata?.category) {
        cats.add(content.metadata.category)
      }
    })
    return Array.from(cats).sort()
  }, [archiveContent])

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = archiveContent.filter(content => {
      const matchesSearch = 
        content.attackType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.date.includes(searchTerm) ||
        (content.metadata?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = 
        categoryFilter === 'all' || 
        content.metadata?.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'name-asc':
          return a.attackType.localeCompare(b.attackType)
        case 'name-desc':
          return b.attackType.localeCompare(a.attackType)
        default:
          return 0
      }
    })

    return filtered
  }, [archiveContent, searchTerm, categoryFilter, sortBy])

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                         <input
               type="text"
               placeholder="Search by attack type, date, or category..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                             <select
                 value={categoryFilter}
                 onChange={(e) => setCategoryFilter(e.target.value)}
                 className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                             <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-center">
        <div className="bg-gray-100 border border-gray-200 rounded-lg px-6 py-3 inline-block">
          <span className="text-2xl font-bold text-blue-600">{filteredContent.length}</span>
          <span className="text-gray-700 ml-2">
            {filteredContent.length === 1 ? 'Entry' : 'Entries'}
            {searchTerm || categoryFilter !== 'all' ? ' Found' : ' Total'}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {filteredContent.map((content) => (
            <Link 
              key={content.date} 
              href={`/day/${content.date}`}
              className="group relative bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between hover:shadow-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(content.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {content.attackType}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {content.metadata?.category ? `Category: ${content.metadata.category}` : 'Detailed cybersecurity threat analysis and mitigation strategies'}
                </p>
              </div>
              
              <div className="ml-6">
                <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-700 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 