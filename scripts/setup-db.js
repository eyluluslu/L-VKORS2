const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Veritabanı kurulumu başlatılıyor...')

  // Demo kullanıcıları oluştur
  const adminPassword = await bcrypt.hash('123456', 12)
  const userPassword = await bcrypt.hash('123456', 12)

  // Admin kullanıcısı
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Normal kullanıcı
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER'
    }
  })

  // Demo kategoriler oluştur
  const electronics = await prisma.category.upsert({
    where: { name: 'Elektronik' },
    update: {},
    create: {
      name: 'Elektronik',
      description: 'Elektronik ürünler'
    }
  })

  const clothing = await prisma.category.upsert({
    where: { name: 'Giyim' },
    update: {},
    create: {
      name: 'Giyim',
      description: 'Giyim ürünleri'
    }
  })

  // Demo ürünler oluştur
  await prisma.product.upsert({
    where: { name: 'iPhone 15' },
    update: {},
    create: {
      name: 'iPhone 15',
      description: 'Apple iPhone 15 - 128GB',
      price: 999.99,
      stock: 10,
      categoryId: electronics.id,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    }
  })

  await prisma.product.upsert({
    where: { name: 'Samsung Galaxy S24' },
    update: {},
    create: {
      name: 'Samsung Galaxy S24',
      description: 'Samsung Galaxy S24 - 256GB',
      price: 799.99,
      stock: 15,
      categoryId: electronics.id,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    }
  })

  await prisma.product.upsert({
    where: { name: 'Erkek Tişört' },
    update: {},
    create: {
      name: 'Erkek Tişört',
      description: '100% Pamuk Erkek Tişört',
      price: 29.99,
      stock: 50,
      categoryId: clothing.id,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    }
  })

  console.log('✅ Veritabanı kurulumu tamamlandı!')
  console.log('📧 Demo hesaplar:')
  console.log('   Admin: admin@test.com / 123456')
  console.log('   Kullanıcı: user@test.com / 123456')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 