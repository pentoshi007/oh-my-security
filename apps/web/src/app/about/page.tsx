import { ShieldCheck, Cpu, Rss } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tighter leading-tight">
            How Oh-My-Security Works
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Our mission is to provide free, high-quality cybersecurity education by breaking down real-world attacks every single day.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Step 1: Fetch News */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Rss className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Daily News Scan</h3>
              <p className="text-gray-600">
                Every morning, our automated system scans thousands of articles from reputable cybersecurity news sources to find the most relevant, recent, and impactful threat reports.
              </p>
            </div>

            {/* Step 2: AI Analysis */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI-Powered Analysis</h3>
              <p className="text-gray-600">
                The chosen article is fed into our advanced AI, which generates a comprehensive breakdown. It identifies the attack type from over 25 categories and crafts detailed educational content.
              </p>
            </div>

            {/* Step 3: Content Breakdown */}
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Red & Blue Team Insights</h3>
              <p className="text-gray-600">
                The final analysis provides two critical perspectives: Blue Team (how to defend against the attack) and Red Team (how the attack is executed), complete with methodologies and exploit code for learning.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 