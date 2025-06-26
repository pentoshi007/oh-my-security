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
      <div className="flex items-center justify-center border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-4 -mb-px">
          {tabs.map((tab, index) => {
            const isActive = activeTab === index
            return (
              <button
                key={tab.title}
                onClick={() => setActiveTab(index)}
                className={`relative px-3 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors focus:outline-none ${
                  isActive ? 'text-black' : 'text-gray-500 hover:text-gray-800'
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

      {/* Tab Content */}
      <div className="pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`p-6 sm:p-8 rounded-xl transition-colors ${
              isBlueActive 
                ? 'bg-blue-500/5' 
                : 'bg-red-500/5'
            }`}
          >
            {tabs[activeTab].title === 'Exploit Code' ? (
              <div className="bg-gray-900 text-sm text-green-400 p-4 rounded-xl overflow-x-auto font-mono">
                <pre><code>{tabs[activeTab].content}</code></pre>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                {formatContent(tabs[activeTab].content)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 