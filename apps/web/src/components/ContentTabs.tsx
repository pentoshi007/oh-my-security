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
      {/* Tab Buttons */}
      <div className="border-b border-gray-200">
        <div className="max-w-full overflow-x-auto">
          <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-4 -mb-px px-4">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index
              return (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(index)}
                  className={`relative px-3 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors focus:outline-none ${isActive
                      ? (isBlueActive ? 'text-blue-600' : 'text-red-600')
                      : 'text-gray-500 hover:text-black'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`transition-colors ${isActive ? (isBlueActive ? 'text-blue-500' : 'text-red-500') : 'text-gray-400'}`}>
                      {tab.icon}
                    </span>
                    {tab.title}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${isBlueActive ? 'bg-blue-500' : 'bg-red-500'}`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`p-6 sm:p-8 rounded-2xl transition-colors backdrop-blur-lg border ${isBlueActive
              ? 'bg-blue-500/10 border-blue-500/20'
              : 'bg-red-500/10 border-red-500/20'
              }`}
          >
            {tabs[activeTab].title === 'Exploit Code' ? (
              <div className="bg-gray-900/80 text-sm text-green-400 p-4 rounded-xl overflow-x-auto font-mono backdrop-blur-sm border border-gray-500/20">
                <pre><code>{tabs[activeTab].content}</code></pre>
              </div>
            ) : (
              <div className="prose prose-lg max-w-5xl mx-auto prose-gray prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800">
                {formatContent(tabs[activeTab].content)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 