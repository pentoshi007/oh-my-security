'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Github, Calendar, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false)
  }, [pathname])

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('[data-mobile-menu]')) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15, ease: 'easeIn' } }
  }

  return (
    <header className="sticky top-0 z-50 glassmorphism shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-18">
          {/* Logo - Mobile Optimized */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
                Oh-My-Security
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/#today" className="text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg px-4 py-2 transition-all duration-200 hover:bg-gray-500/10">
              Today
            </Link>
            <Link href="/archive" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg px-4 py-2 transition-all duration-200 hover:bg-gray-500/10">
              <Calendar className="w-4 h-4" />
              <span>Archive</span>
            </Link>
            <a href="https://github.com/pentoshi007/oh-my-security" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black rounded-lg p-2 transition-all duration-200 hover:bg-gray-500/10" aria-label="GitHub Repository">
              <Github className="w-5 h-5" />
            </a>
          </nav>

          {/* Mobile Menu Button - Improved Touch Target */}
          <div className="md:hidden" data-mobile-menu>
            <button 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>

          {/* Mobile Menu Dropdown - Enhanced */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                  style={{ top: '0' }}
                />
                
                {/* Menu Content */}
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full left-0 right-0 mx-4 mt-2"
                  style={{ transformOrigin: 'top center' }}
                  data-mobile-menu
                >
                  <div className="glassmorphism shadow-lg rounded-xl border border-gray-200/50">
                    <nav className="flex flex-col p-2">
                      <Link 
                        href="/#today" 
                        className="flex items-center px-4 py-4 text-base font-medium text-gray-800 hover:bg-gray-500/10 rounded-lg transition-colors active:bg-gray-500/20"
                      >
                        <span>Today's Threat</span>
                      </Link>
                      <Link 
                        href="/archive" 
                        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-800 hover:bg-gray-500/10 rounded-lg transition-colors active:bg-gray-500/20"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Archive</span>
                      </Link>
                      <a 
                        href="https://github.com/pentoshi007/oh-my-security" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-800 hover:bg-gray-500/10 rounded-lg transition-colors active:bg-gray-500/20"
                      >
                        <Github className="w-5 h-5" />
                        <span>GitHub</span>
                      </a>
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
} 