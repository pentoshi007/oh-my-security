import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sora = Sora({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Oh-My-Security",
  description: "A daily-updated, zero-cost cybersecurity learning platform breaking down real-world attacks for educational purposes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.className}>
      <body className="bg-white text-gray-800">
        <Header />
        <main className="min-h-[calc(100vh-4rem-1px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}