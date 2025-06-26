import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 shadow-sm">
      <div id="fixed-footer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Oh-My-Security
                </span>
              </Link>
              <p className="text-gray-600 text-sm">
                Daily cybersecurity threat analysis for educational purposes.
              </p>
            </div>

            {/* Navigation & Social Links */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navigate</h3>
                <ul className="mt-4 space-y-3">
                  <li><Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">Today's Attack</Link></li>
                  <li><Link href="/archive" className="text-sm text-gray-600 hover:text-black transition-colors">Archive</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Project</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="https://github.com/pentoshi007/oh-my-security" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors">GitHub Repo</a></li>
                  <li><Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">About</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="https://linkedin.com/in/aniket00736" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors">LinkedIn</a></li>
                  <li><a href="https://x.com/lunatic_ak_" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors">Twitter / X</a></li>
                  <li><a href="https://github.com/pentoshi007" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-black transition-colors">My GitHub</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Oh-My-Security. Built by Aniket Pandey.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 