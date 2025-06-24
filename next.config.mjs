/** @type {import('next').NextConfig} */

// Ortam değişkenlerini manuel olarak ayarla
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'livkors-secret-key-2024-production';
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

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
