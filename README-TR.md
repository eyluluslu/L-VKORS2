# E-Ticaret Uygulaması

Bu proje Next.js 15, Prisma ve Tailwind CSS kullanılarak geliştirilmiş bir e-ticaret uygulamasıdır.

## 🚀 Kurulum

### 1. Bağımlılıkları yükleyin:
```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın:
`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (güçlü bir secret kullanın)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
```

### 3. Veritabanını hazırlayın:
```bash
# Prisma client'ı oluştur
npx prisma generate

# Veritabanını oluştur
npx prisma db push

# Demo verileri ekle
node scripts/setup-db.js
```

### 4. Uygulamayı başlatın:
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 👤 Demo Hesaplar

Uygulama aşağıdaki demo hesaplarla birlikte gelir:

- **Admin**: admin@test.com / 123456
- **Kullanıcı**: user@test.com / 123456

## 🛠️ Özellikler

- ✅ Kullanıcı kimlik doğrulama
- ✅ Admin paneli
- ✅ Ürün yönetimi
- ✅ Kategori yönetimi
- ✅ Responsive tasarım
- ✅ SQLite veritabanı

## 🐛 Sorun Giderme

### Giriş yaparken hata alıyorsanız:

1. `.env.local` dosyasının doğru yapılandırıldığından emin olun
2. Veritabanının oluşturulduğundan emin olun: `npx prisma db push`
3. Demo kullanıcıları oluşturun: `node scripts/setup-db.js`
4. Prisma client'ı yeniden oluşturun: `npx prisma generate`

### Veritabanı sorunları:

```bash
# Veritabanını sıfırla
rm prisma/dev.db
npx prisma db push
node scripts/setup-db.js
```

## 📁 Proje Yapısı

```
my-app/
├── src/
│   ├── app/                 # Next.js App Router sayfaları
│   ├── components/          # React bileşenleri
│   ├── lib/                # Yardımcı fonksiyonlar
│   └── generated/          # Prisma client (otomatik oluşturulur)
├── prisma/
│   └── schema.prisma       # Veritabanı şeması
└── scripts/
    └── setup-db.js         # Veritabanı kurulum scripti
``` 