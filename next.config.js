/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn1.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn2.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn3.gstatic.com',
      },
    ],
  },
  async rewrites() {
    return [
      // SEO-friendly URLs for city pages
      {
        source: '/cheap-flights-from-:slug',
        destination: '/:slug',
      },
    ]
  },
  async redirects() {
    return [
      // Redirect old /city/ URLs to new SEO-friendly URLs (301 permanent)
      {
        source: '/city/:slug',
        destination: '/cheap-flights-from-:slug',
        permanent: true,
      },
      // Blog redirects disabled for preview
      // {
      //   source: '/blog',
      //   destination: '/',
      //   permanent: false,
      // },
      // {
      //   source: '/blog/:slug*',
      //   destination: '/',
      //   permanent: false,
      // },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
