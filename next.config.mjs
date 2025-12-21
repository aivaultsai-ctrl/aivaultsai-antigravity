/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix: Reverted to working state by removing 'undefined' properties which break Vercel's manifest pathing
  outputFileTracing: false,
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
