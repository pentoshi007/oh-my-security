'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronDown, X } from 'lucide-react'

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

  const clearSearch = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setSortBy('date-desc')
  }

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || sortBy !== 'date-desc'

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls - Mobile Optimized */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
        <div className="space-y-4">
          {/* Search - Full Width */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search attacks, dates, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
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
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                onClick={clearSearch}
                className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count - Mobile Optimized */}
      <div className="text-center">
        <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 sm:px-6 py-3 inline-block">
          <span className="text-xl sm:text-2xl font-bold text-blue-600">{filteredContent.length}</span>
          <span className="text-gray-700 ml-2 text-sm sm:text-base">
            {filteredContent.length === 1 ? 'Entry' : 'Entries'}
            {hasActiveFilters ? ' Found' : ' Total'}
          </span>
        </div>
      </div>

      {/* Content Grid - Mobile Optimized */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {filteredContent.map((content) => (
            <Link 
              key={content.date} 
              href={`/day/${content.date}`}
              className="group relative bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:bg-gray-100 hover:scale-[1.01] transition-all duration-300 flex items-center justify-between hover:shadow-lg active:scale-[0.99]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-4 mb-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">
                      {new Date(content.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {content.attackType}
                </h3>
                
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                  {content.metadata?.category ? `Category: ${content.metadata.category}` : 'Detailed cybersecurity threat analysis and mitigation strategies'}
                </p>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-gray-700 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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