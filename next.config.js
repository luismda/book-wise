/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.tsx', 'api.ts'],
  images: {
    remotePatterns: [
      {
        hostname: 'github.com',
      },
    ],
  },
}

module.exports = nextConfig
