import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const sora = Sora({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'] 
})

export const metadata: Metadata = {
  title: 'Oh-My-Security | Daily Cybersecurity Learning',
  description: 'Daily cybersecurity attack breakdowns with blue team defense and red team offense insights',
  keywords: ['cybersecurity', 'security', 'hacking', 'red team', 'blue team', 'penetration testing'],
  authors: [{ name: 'Aniket Pandey' }],
  creator: 'Aniket Pandey',
  publisher: 'Oh-My-Security',
  openGraph: {
    title: 'Oh-My-Security | Daily Cybersecurity Learning',
    description: 'Learn about cybersecurity attacks with daily breakdowns covering defense and offense',
    url: 'https://oh-my-security.vercel.app',
    siteName: 'Oh-My-Security',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oh-My-Security | Daily Cybersecurity Learning',
    description: 'Learn about cybersecurity attacks with daily breakdowns covering defense and offense',
    creator: '@lunatic_ak_',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="oms">
      <body className={sora.className}>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
} 