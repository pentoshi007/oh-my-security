/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export settings to enable API routes and SSR
  transpilePackages: [],
  
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Enable image optimization for better performance
  images: {
    domains: [], // Add any external image domains here if needed
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimize bundle size
  swcMinify: true,
  
  // Enable compression
  compress: true,
  
  // Better error handling in production
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig 