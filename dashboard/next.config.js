/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable standalone output for Docker deployments
  output: 'standalone',

  // Configure external links to existing portals
  async rewrites() {
    return [
      {
        source: '/analytics/:path*',
        destination: 'https://analytics.candidstudios.net/:path*',
      },
      {
        source: '/referral/:path*',
        destination: 'https://referral.candidstudios.net/:path*',
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
