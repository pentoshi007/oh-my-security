import { ShieldCheck, Cpu, Rss, Database, Zap, Calendar, TrendingUp, Book } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tighter leading-tight">
            How Oh-My-Security Works
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Our mission is to provide free, high-quality cybersecurity education through automated daily content that breaks down real-world attack methodologies from both offensive and defensive perspectives.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mt-20">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1: Attack Selection */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Database className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Attack Selection</h3>
              <p className="text-gray-600">
                Our system intelligently selects from 25+ attack methodologies in our database, tracking recently covered topics to ensure variety and comprehensive coverage.
              </p>
            </div>

            {/* Step 2: News Gathering */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mx-auto mb-4">
                <Rss className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. News Gathering</h3>
              <p className="text-gray-600">
                Using newsdata.io API, we fetch the latest cybersecurity news with strict relevance matching to ensure articles specifically match the selected attack topic.
              </p>
            </div>

            {/* Step 3: AI Analysis */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. AI Generation</h3>
              <p className="text-gray-600">
                Google Gemini AI analyzes the attack methodology and generates comprehensive educational content with detailed blue team and red team perspectives.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dual Perspective Analysis</h3>
                  <p className="text-gray-600">
                    Every attack is analyzed from both blue team (defensive) and red team (offensive) perspectives, providing a complete understanding of the threat landscape.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-600 text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fully Automated</h3>
                  <p className="text-gray-600">
                    Vercel cron jobs run daily at 12:01 AM IST, automatically generating and publishing new content without any manual intervention.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-600 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Consistency</h3>
                  <p className="text-gray-600">
                    Fresh content delivered every single day, covering a different attack methodology to build comprehensive security knowledge over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-600 text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Strict Relevance</h3>
                  <p className="text-gray-600">
                    Advanced filtering ensures news articles specifically match the daily topic - no generic cybersecurity news that doesn't relate to the attack.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 bg-gradient-to-br from-gray-50 to-white p-12 rounded-3xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Built With Modern Technology</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            100% free and open-source infrastructure powered by industry-leading platforms
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-blue-600 font-mono text-sm mb-2">Frontend</div>
              <div className="text-gray-900 font-semibold">Next.js 15</div>
              <div className="text-gray-600 text-sm">React, Tailwind CSS, DaisyUI</div>
            </div>

            <div className="text-center">
              <div className="text-green-600 font-mono text-sm mb-2">Database</div>
              <div className="text-gray-900 font-semibold">Supabase</div>
              <div className="text-gray-600 text-sm">PostgreSQL for content storage</div>
            </div>

            <div className="text-center">
              <div className="text-purple-600 font-mono text-sm mb-2">AI Generation</div>
              <div className="text-gray-900 font-semibold">Google Gemini</div>
              <div className="text-gray-600 text-sm">Gemini 2.5 Flash model</div>
            </div>

            <div className="text-center">
              <div className="text-orange-600 font-mono text-sm mb-2">News API</div>
              <div className="text-gray-900 font-semibold">newsdata.io</div>
              <div className="text-gray-600 text-sm">Strict relevance matching</div>
            </div>

            <div className="text-center">
              <div className="text-red-600 font-mono text-sm mb-2">Automation</div>
              <div className="text-gray-900 font-semibold">Vercel Cron</div>
              <div className="text-gray-600 text-sm">Daily at 12:01 AM IST</div>
            </div>

            <div className="text-center">
              <div className="text-indigo-600 font-mono text-sm mb-2">Subscriptions</div>
              <div className="text-gray-900 font-semibold">MongoDB Atlas</div>
              <div className="text-gray-600 text-sm">Email subscriber management</div>
            </div>
          </div>
        </div>

        {/* Content Categories */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Attack Coverage</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our database includes 25+ attack methodologies across multiple categories
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-3">Web Attacks</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• SQL Injection</li>
                <li>• XSS</li>
                <li>• CSRF</li>
                <li>• XXE</li>
                <li>• SSRF</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h4 className="font-semibold text-red-900 mb-3">Network</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• DDoS</li>
                <li>• DNS Poisoning</li>
                <li>• ARP Spoofing</li>
                <li>• SSL Stripping</li>
                <li>• Port Scanning</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-3">Malware</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Ransomware</li>
                <li>• Trojans</li>
                <li>• Rootkits</li>
                <li>• Keyloggers</li>
                <li>• Spyware</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-900 mb-3">Social Eng.</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Phishing</li>
                <li>• Vishing</li>
                <li>• Pretexting</li>
                <li>• Baiting</li>
                <li>• Tailgating</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-3xl text-white">
          <Book className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
            Join our community of security professionals and enthusiasts. Get fresh cybersecurity knowledge delivered daily.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              View Today's Topic
            </Link>
            <Link
              href="/archive"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              Browse Archive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
