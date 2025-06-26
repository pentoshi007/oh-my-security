'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ContentTabsProps {
  blueTeam: { title: string; content: string; icon: React.ReactNode }[]
  redTeam: { title: string; content: string; icon: React.ReactNode }[]
}

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
}

// Function to format content with proper line breaks and structure
const formatContent = (content: string): React.ReactNode[] => {
  if (!content) return [];

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '') continue;

    // Check for a numbered list item
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      const listItems = [];
      let listProcessingIndex = i;

      // This loop will gather all sequential numbered list items
      while (listProcessingIndex < lines.length) {
        const currentLineForList = lines[listProcessingIndex].trim();
        const matchForList = currentLineForList.match(/^(\d+)\.\s+(.+)/);

        if (matchForList) {
          const title = matchForList[2];
          let description = '';
          let lookaheadIndex = listProcessingIndex + 1;

          // Gather description paragraphs for the current list item
          while (
            lookaheadIndex < lines.length &&
            lines[lookaheadIndex].trim() !== '' &&
            !lines[lookaheadIndex].trim().match(/^(\d+)\.\s+/)
          ) {
            description += lines[lookaheadIndex].trim() + ' ';
            lookaheadIndex++;
          }

          listItems.push({ title, description: description.trim() });
          listProcessingIndex = lookaheadIndex;
        } else {
          // The sequence of list items has ended
          break;
        }
      }

      // Render the entire list we just collected
      elements.push(
        <div key={`list-container-${key++}`} className="space-y-8 my-6">
          {listItems.map((item, idx) => (
            <div key={idx}>
              <p className="font-bold text-lg text-gray-800">
                {item.title}
              </p>
              {item.description && (
                <p className="mt-2 text-base text-gray-600 leading-relaxed pl-6">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );

      // Adjust the main loop's index to continue after the list we just processed
      i = listProcessingIndex - 1;
      continue;
    }

    // Check for section headers (e.g., "Financial Consequences:")
    if (line.endsWith(':') && line.length < 100 && !line.includes('http')) {
      elements.push(
        <h3 key={`header-${key++}`} className="text-xl font-bold mt-8 mb-4 text-gray-800">
          {line}
        </h3>
      );
      continue;
    }

    // Default to a regular paragraph
    elements.push(
      <p key={`para-${key++}`} className="mb-4 leading-relaxed text-base">
        {line}
      </p>
    );
  }

  return elements;
};

export default function ContentTabs({ blueTeam, redTeam }: ContentTabsProps) {
  const tabs = [...blueTeam, ...redTeam]
  const [activeTab, setActiveTab] = useState(0)

  const isBlueActive = activeTab < blueTeam.length

  return (
    <div>
      {/* Tab Buttons */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 pb-2 -mb-px">
          {tabs.map((tab, index) => {
            const isBlue = index < blueTeam.length
            const isActive = activeTab === index
            
            return (
              <button
                key={tab.title}
                onClick={() => setActiveTab(index)}
                className={`relative shrink-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors focus:outline-none rounded-t-md ${
                  isActive
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${isActive ? (isBlue ? 'text-blue-500' : 'text-red-500') : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  {tab.title}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isBlue ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`p-6 sm:p-8 rounded-xl transition-colors ${
            isBlueActive 
              ? 'bg-blue-500/5' 
              : 'bg-red-500/5'
          }`}
        >
          <div
            className={`max-w-none ${
              isBlueActive
                ? 'text-blue-900/80'
                : 'text-red-900/80'
            }`}
          >
            {tabs[activeTab].title === 'Exploit Code' ? (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap !bg-transparent !p-0">
                  <code>{tabs[activeTab].content}</code>
                </pre>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                {formatContent(tabs[activeTab].content)}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 