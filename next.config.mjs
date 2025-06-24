/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Vercel için optimize edilmiş build
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',  // Vercel domain'leri için
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',  // Cloudinary için
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Statik dosyalar için headers
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
};

export default nextConfig;
