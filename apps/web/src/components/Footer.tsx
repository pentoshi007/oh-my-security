import Link from 'next/link'
import { Shield, Linkedin, Twitter, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="glassmorphism-footer mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* About Section */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Oh-My-Security
                </span>
              </Link>
            <p className="text-gray-700 text-sm max-w-xs">
                Daily cybersecurity threat analysis for educational purposes.
              </p>
            </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-gray-600">
            <a href="https://linkedin.com/in/aniket00736" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-700 transition-all duration-200 transform hover:scale-110">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://x.com/lunatic_ak_" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-black transition-all duration-200 transform hover:scale-110">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://github.com/pentoshi007" target="_blank" rel="noopener noreferrer" aria-label="My GitHub" className="text-gray-500 hover:text-black transition-all duration-200 transform hover:scale-110">
              <Github className="w-6 h-6" />
            </a>
            </div>
          </div>

        {/* Sub-Footer */}
        <div className="mt-8 pt-8 border-t border-gray-300/40 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-700 gap-4">
          <p className="order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Oh-My-Security. Built by <a href="https://github.com/pentoshi007" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-black transition-colors">Aniket</a>
          </p>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <Link href="/archive" className="hover:text-black transition-colors">Archive</Link>
            <Link href="/about" className="hover:text-black transition-colors">About</Link>
            <a href="https://github.com/pentoshi007/oh-my-security" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Source Code</a>
          </div>
        </div>
      </div>
    </footer>
  )
} 