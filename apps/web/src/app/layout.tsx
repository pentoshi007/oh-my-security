import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sora = Sora({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  title: {
    default: "Oh-My-Security - Daily Cybersecurity Education",
    template: "%s | Oh-My-Security"
  },
  description: "Master cybersecurity with daily real-world attack analysis. Learn defensive blue team strategies and offensive red team techniques. Free educational content for security professionals.",
  keywords: [
    "cybersecurity education", 
    "blue team", 
    "red team", 
    "penetration testing", 
    "threat intelligence", 
    "security analysis", 
    "cyber attacks", 
    "incident response", 
    "ethical hacking", 
    "InfoSec training"
  ],
  authors: [{ name: "Oh-My-Security Team" }],
  creator: "Oh-My-Security",
  publisher: "Oh-My-Security",
  applicationName: "Oh-My-Security",
  category: "Education",
  classification: "Cybersecurity Education",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oh-my-security.vercel.app",
    siteName: "Oh-My-Security",
    title: "Oh-My-Security - Daily Cybersecurity Education",
    description: "Master cybersecurity with daily real-world attack analysis. Learn blue team defense and red team offense techniques.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Oh-My-Security - Daily Cybersecurity Education",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@ohmysecurity",
    creator: "@ohmysecurity",
    title: "Oh-My-Security - Daily Cybersecurity Education",
    description: "Master cybersecurity with daily real-world attack analysis. Learn blue team defense and red team offense techniques.",
    images: ["/og-image.png"],
  },
  
  // Additional Meta
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (add when you have accounts)
  verification: {
    google: "your-google-verification-code",
    // other: {
    //   "msvalidate.01": "your-bing-verification-code",
    // },
  },
  
  // App-specific
  manifest: "/manifest.json",
  
  // Other
  metadataBase: new URL("https://oh-my-security.vercel.app"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.className}>
      <body className="bg-white text-gray-800 antialiased">
        <Header />
        <main className="min-h-[calc(100vh-4rem-1px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}