/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable output file tracing to fix Vercel routes-manifest error
  outputFileTracingRoot: undefined,
  outputFileTracing: false,
  
  experimental: {
    // Zorg dat deze off is
    outputFileTracingIncludes: undefined,
  },

  // Andere configuraties
  reactStrictMode: true,
  swcMinify: true,
  
  // Als je images gebruikt:
  images: {
    domains: ['firebasestorage.googleapis.com'], // voor Firebase images
  },

  // Build safety
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
