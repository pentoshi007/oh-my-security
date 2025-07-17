'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface ContentSectionProps {
  id?: string
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export default function ContentSection({
  id,
  children,
  className = '',
  title,
  subtitle
}: ContentSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [shouldBounce, setShouldBounce] = useState(false)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    // Check if this section is being targeted by hash on load
    if (id && window.location.hash === `#${id}`) {
      setShouldBounce(true)
      // Remove bounce after animation completes
      setTimeout(() => setShouldBounce(false), 800)
    }

    // Listen for hash changes (when clicking anchor links)
    const handleHashChange = () => {
      if (id && window.location.hash === `#${id}`) {
        setShouldBounce(true)
        setTimeout(() => setShouldBounce(false), 800)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [id])

  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    bounce: {
      y: [0, -10, 5, -3, 0],
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
        times: [0, 0.3, 0.6, 0.8, 1]
      }
    }
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={
        shouldBounce 
          ? 'bounce' 
          : isInView 
            ? 'visible' 
            : 'hidden'
      }
      className={`scroll-mt-20 ${className}`}
    >
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </motion.section>
  )
} 