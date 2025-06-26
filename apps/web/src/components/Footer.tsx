import { Heart, Linkedin, Twitter, Github, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Oh-My-Security
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm">
              A daily-updated, zero-cost cybersecurity learning platform breaking down real-world attacks for educational purposes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navigate</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Today's Attack</Link></li>
              <li><Link href="/archive" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Archive</Link></li>
              <li><a href="https://github.com/pentoshi007/oh-my-security" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">GitHub Repo</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="https://linkedin.com/in/aniket00736" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">LinkedIn</a></li>
              <li><a href="https://x.com/lunatic_ak_" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Twitter / X</a></li>
              <li><a href="https://github.com/pentoshi007" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">My GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Oh-My-Security. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-4 sm:mt-0">
            Built with <Heart className="w-4 h-4 text-red-500 inline" fill="currentColor" /> by Aniket Pandey.
          </p>
        </div>
      </div>
    </footer>
  )
} 