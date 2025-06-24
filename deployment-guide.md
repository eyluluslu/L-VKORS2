# 🚀 Livkors E-ticaret Sitesi Deployment Rehberi

## 1. Vercel ile Deployment (Önerilen - Ücretsiz)

### Ön Hazırlık
```bash
# 1. GitHub'a yükleyin
git init
git add .
git commit -m "Initial commit"
# GitHub'da repo oluşturun ve push edin
```

### Vercel Deployment
1. [vercel.com](https://vercel.com) → GitHub ile giriş
2. "New Project" → GitHub repo'nuzu seçin
3. Project Name: `livkors-ecommerce`
4. Framework Preset: `Next.js`
5. Root Directory: `my-app`

### Environment Variables (Vercel Dashboard'da)
```
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-site.vercel.app
```

## 2. Veritabanı Seçenekleri

### A) Neon (PostgreSQL - Ücretsiz)
1. [neon.tech](https://neon.tech) → Hesap oluştur
2. Yeni database oluştur
3. Connection string'i kopyala
4. `DATABASE_URL` olarak Vercel'e ekle

### B) PlanetScale (MySQL - Ücretsiz)
1. [planetscale.com](https://planetscale.com) → Hesap oluştur
2. Yeni database oluştur
3. Connection string'i al

### C) Supabase (PostgreSQL - Ücretsiz)
1. [supabase.com](https://supabase.com) → Hesap oluştur
2. Yeni proje oluştur
3. Database URL'i kopyala

## 3. Veritabanı Schema Güncellemesi

PostgreSQL için schema'yı güncelleyin:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // sqlite yerine postgresql
  url      = env("DATABASE_URL")
}
```

### Migration Komutları
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed  # eğer seed dosyanız varsa
```

## 4. Build Konfigürasyonu

### next.config.mjs Güncelleme
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Vercel için
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'your-domain.vercel.app',  // Kendi domain'iniz
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
}

export default nextConfig
```

## 5. File Upload için Cloudinary

Uploads klasörü production'da çalışmaz. Cloudinary kullanın:

1. [cloudinary.com](https://cloudinary.com) → Hesap oluştur
2. API keys'i alın
3. Environment variables'a ekleyin:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 6. Deployment Checklist

- [ ] GitHub'a kod yüklendi
- [ ] Vercel'de proje oluşturuldu
- [ ] Environment variables eklendi
- [ ] PostgreSQL database bağlandı
- [ ] Domain özelleştirildi (isteğe bağlı)
- [ ] SSL sertifikası aktif
- [ ] File upload Cloudinary'e bağlandı

## 7. Custom Domain (İsteğe bağlı)

1. Domain satın alın (GoDaddy, Namecheap, etc.)
2. Vercel dashboard → Domains
3. Domain'i ekleyin ve DNS ayarlarını yapın

## 8. Üretim Sonrası

1. Admin hesabı oluşturun
2. Test verilerini ekleyin
3. Site ayarlarını güncelleyin
4. SEO optimizasyonu yapın

## 🔧 Production Scripts

```bash
# Build test
npm run build

# Production start
npm run start

# Database reset (dikkatli kullanın!)
npx prisma migrate reset
```

## 📊 Monitoring

- Vercel Analytics (ücretsiz)
- Vercel Speed Insights
- Google Analytics ekleyebilirsiniz

---

🎉 **Deployment tamamlandıktan sonra siteniz şu adreste canlı olacak:**
`https://your-project-name.vercel.app` 