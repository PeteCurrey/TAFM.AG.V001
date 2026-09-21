import type { NextConfig } from 'next'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
]

const nextConfig: NextConfig = {
  // Security headers on all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Image optimisation
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add trusted image domains as integrations are established
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Transpile Three.js for Next.js compatibility
  transpilePackages: ['three'],

  // Experimental features for Next.js 15
  experimental: {
    // Optimise package imports
    optimizePackageImports: [
      'framer-motion',
      'three',
    ],
  },


  // Redirect legacy routes if any emerge
  async redirects() {
    return []
  },

  // Strict mode for React 19
  reactStrictMode: true,

  // Output for deployment flexibility
  // output: 'standalone', // Uncomment for containerised deployment
}

export default nextConfig
