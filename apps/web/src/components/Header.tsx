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
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20, 
      transition: { 
        duration: 0.2, 
        ease: [0.4, 0, 1, 1] 
      } 
    }
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
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
            <Link href="/#today" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg px-4 py-2 transition-all duration-200 hover:bg-gray-500/10">
              Today
            </Link>
            <Link href="/archive" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg px-4 py-2 transition-all duration-200 hover:bg-gray-500/10">
              <Calendar className="w-4 h-4" />
              <span>Archive</span>
            </Link>
            <a href="https://github.com/pentoshi007/oh-my-security" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-500 hover:text-black rounded-lg px-4 py-2 transition-all duration-200 hover:bg-gray-500/10" aria-label="GitHub Repository">
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

          {/* Mobile Menu Dropdown - Enhanced with better positioning */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop with improved blur effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
                  style={{ top: '0' }}
                />
                {/* Menu Content - positioned below navbar with improved styling */}
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed top-16 right-4 left-4 mx-auto max-w-sm w-full z-50"
                  style={{ transformOrigin: 'top center' }}
                  data-mobile-menu
                >
                  <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 px-6 pt-6 pb-4 overflow-hidden">
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-50" />
                    <div className="relative z-10">
                      {/* Close button at top right */}
                      <button
                        onClick={toggleMenu}
                        aria-label="Close menu"
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/80 transition-colors backdrop-blur-sm"
                      >
                        <X className="w-6 h-6 text-gray-700" />
                      </button>
                      <nav className="flex flex-col gap-3 mt-4">
                        <motion.div variants={menuItemVariants}>
                          <Link 
                            href="/#today" 
                            className="flex items-center gap-3 px-4 py-4 text-lg font-semibold text-gray-900 hover:bg-blue-50/80 rounded-xl transition-all duration-200 active:bg-blue-100/80 backdrop-blur-sm border border-transparent hover:border-blue-200/50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="inline-block bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-2 mr-3 shadow-lg">
                              <Calendar className="w-5 h-5" />
                            </span>
                            Today's Threat
                          </Link>
                        </motion.div>
                        <motion.div variants={menuItemVariants}>
                          <Link 
                            href="/archive" 
                            className="flex items-center gap-3 px-4 py-4 text-lg font-semibold text-gray-900 hover:bg-blue-50/80 rounded-xl transition-all duration-200 active:bg-blue-100/80 backdrop-blur-sm border border-transparent hover:border-blue-200/50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="inline-block bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full p-2 mr-3 shadow-lg">
                              <Calendar className="w-5 h-5" />
                            </span>
                            Archive
                          </Link>
                        </motion.div>
                        <motion.div variants={menuItemVariants}>
                          <a 
                            href="https://github.com/pentoshi007/oh-my-security" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 px-4 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-50/80 rounded-xl transition-all duration-200 active:bg-gray-100/80 backdrop-blur-sm border border-transparent hover:border-gray-200/50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="inline-block bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-full p-2 mr-3 shadow-lg">
                              <Github className="w-5 h-5" />
                            </span>
                            GitHub
                          </a>
                        </motion.div>
                      </nav>
                    </div>
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