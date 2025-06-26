'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  const formatContent = (content: string): React.ReactNode[] => {
    if (!content) return []
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line === '') continue

      const numberedMatch = line.match(/^(\d+)\.\s+(.+)/)
      if (numberedMatch) {
        const listItems = []
        let listIndex = i
        while (listIndex < lines.length) {
          const currentLine = lines[listIndex].trim()
          const match = currentLine.match(/^(\d+)\.\s+(.+)/)
          if (match) {
            const title = match[2]
            let description = ''
            let lookahead = listIndex + 1
            while (lookahead < lines.length && lines[lookahead].trim() !== '' && !lines[lookahead].trim().match(/^(\d+)\.\s+/)) {
              description += lines[lookahead].trim() + ' '
              lookahead++
            }
            listItems.push({ title, description: description.trim() })
            listIndex = lookahead
          } else {
            break
          }
        }
        elements.push(
          <div key={`list-${key++}`} className="space-y-6 my-6">
            {listItems.map((item, idx) => (
              <div key={idx}>
                <p className="font-semibold text-lg">{item.title}</p>
                {item.description && <p className="mt-2 text-base leading-relaxed">{item.description}</p>}
              </div>
            ))}
          </div>
        )
        i = listIndex - 1
        continue
      }

      if (line.endsWith(':') && line.length < 100) {
        elements.push(<h3 key={`header-${key++}`} className="text-xl font-bold mt-8 mb-4">{line}</h3>)
        continue
      }

      elements.push(<p key={`para-${key++}`} className="mb-4 leading-relaxed text-base">{line}</p>)
    }
    return elements
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