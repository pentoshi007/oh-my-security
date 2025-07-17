'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface ContentTab {
  title: string
  content: string
  icon: React.ReactNode
}

interface ContentTabsProps {
  blueTeam: ContentTab[]
  redTeam: ContentTab[]
}

const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
}

export default function ContentTabs({ blueTeam, redTeam }: ContentTabsProps) {
  const tabs = [...blueTeam, ...redTeam]
  const [activeTab, setActiveTab] = useState(0)

  const isBlueActive = activeTab < blueTeam.length

  const formatContent = (content: string): React.ReactNode => {
    if (!content) return null;
    return <ReactMarkdown>{content}</ReactMarkdown>;
  }

  return (
    <div>
      {/* Tab Buttons - Mobile Optimized */}
      <div className="border-b border-gray-200">
        {/* Mobile: Stack tabs vertically */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-2 p-4 -mb-px">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index
              return (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(index)}
                  className={`relative px-4 py-4 text-sm font-medium transition-all duration-300 rounded-lg border-2 ${
                    isActive
                      ? (isBlueActive 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                          : 'bg-red-50 border-red-200 text-red-700 shadow-sm')
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className={`transition-colors ${
                      isActive 
                        ? (isBlueActive ? 'text-blue-500' : 'text-red-500') 
                        : 'text-gray-400'
                    }`}>
                      {tab.icon}
                    </span>
                    <span className="text-center leading-tight">{tab.title}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Desktop/Tablet: Horizontal tabs without scrolling */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-center gap-2 -mb-px px-4">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index
              return (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(index)}
                  className={`relative px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-colors focus:outline-none ${
                    isActive
                      ? (isBlueActive ? 'text-blue-600' : 'text-red-600')
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`transition-colors ${
                      isActive 
                        ? (isBlueActive ? 'text-blue-500' : 'text-red-500') 
                        : 'text-gray-400'
                    }`}>
                      {tab.icon}
                    </span>
                    {tab.title}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isBlueActive ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content - Mobile Optimized */}
      <div className="pt-6 sm:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`p-4 sm:p-6 md:p-8 rounded-2xl transition-colors backdrop-blur-lg border ${
              isBlueActive
                ? 'bg-blue-500/10 border-blue-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            {tabs[activeTab].title === 'Exploit Code' ? (
              <div className="bg-gray-900/80 text-sm text-green-400 p-3 sm:p-4 rounded-xl overflow-x-auto font-mono backdrop-blur-sm border border-gray-500/20">
                <pre><code>{tabs[activeTab].content}</code></pre>
              </div>
            ) : (
              <div className="prose prose-sm sm:prose-lg max-w-5xl mx-auto prose-gray prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800">
                {formatContent(tabs[activeTab].content)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 