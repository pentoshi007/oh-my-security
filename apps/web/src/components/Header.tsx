import Link from 'next/link'
import { Shield, Github, Calendar } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-2xl border-b border-gray-200/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline-block">
                Oh-My-Security
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Today
            </Link>
            <Link
              href="/archive"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Archive</span>
            </Link>
            <a
              href="https://github.com/pentoshi007/oh-my-security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
} 