import ContentDisplay from '@/components/ContentDisplay'
import { getTodaysContent } from '@/lib/content'
import Link from 'next/link'
import { Shield, Target, BookOpen, TrendingUp, Users, Globe } from 'lucide-react'

export default async function HomePage() {
  const content = await getTodaysContent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Daily Cybersecurity Education
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Cybersecurity
            <span className="text-blue-600"> One Day </span>
            at a Time
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Learn from real-world cyber attacks with daily content covering both defensive (blue team) 
            and offensive (red team) perspectives. Stay ahead of the latest threats.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Learning Today
            </button>
            <Link href="/about" className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Oh-My-Security?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional cybersecurity education designed for modern security practitioners
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Blue Team Defense</h3>
              <p className="text-gray-600">
                Learn defensive strategies, threat detection, incident response, and security monitoring techniques.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Red Team Offense</h3>
              <p className="text-gray-600">
                Understand attack methodologies, penetration testing, and ethical hacking approaches.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-World Cases</h3>
              <p className="text-gray-600">
                Study actual cyber attacks and breaches with detailed analysis and lessons learned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Today's Learning Topic</h2>
            <p className="text-lg text-gray-600">
              Fresh cybersecurity content delivered daily
            </p>
          </div>
          
          <ContentDisplay content={content} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">25+</div>
              <div className="text-gray-600">Attack Types Covered</div>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">Daily</div>
              <div className="text-gray-600">Fresh Content</div>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-gray-600">Free & Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Level Up Your Security Skills?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join cybersecurity professionals who stay updated with daily threat intelligence and educational content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/archive" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Archive
            </Link>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Subscribe for Updates
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 