const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestData() {
  console.log('🔧 Test verileri oluşturuluyor...')

  try {
    // Admin kullanıcı oluştur/güncelle
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@livkors.com' },
      update: { role: 'ADMIN' },
      create: {
        email: 'admin@livkors.com',
        name: 'Admin Kullanıcı',
        password: adminPassword,
        role: 'ADMIN'
      }
    })
    console.log('✅ Admin kullanıcı oluşturuldu:', admin.email)

    // Test kullanıcıları oluştur
    const userPassword = await bcrypt.hash('user123', 10)
    const testUsers = []
    
    for (let i = 1; i <= 3; i++) {
      const user = await prisma.user.upsert({
        where: { email: `user${i}@test.com` },
        update: {},
        create: {
          email: `user${i}@test.com`,
          name: `Test Kullanıcı ${i}`,
          password: userPassword,
          role: 'USER'
        }
      })
      testUsers.push(user)
      console.log(`✅ Test kullanıcı oluşturuldu: ${user.email}`)
    }

    // Mevcut ürünleri al
    const products = await prisma.product.findMany()
    console.log(`📦 ${products.length} ürün bulundu`)

    if (products.length === 0) {
      console.log('⚠️ Ürün bulunamadı. Önce ürün eklemelisiniz.')
      return
    }

    // Test siparişleri oluştur
    for (const user of testUsers) {
      // Her kullanıcı için 1-3 sipariş oluştur
      const orderCount = Math.floor(Math.random() * 3) + 1
      
      for (let i = 0; i < orderCount; i++) {
        // Rastgele 1-3 ürün seç
        const itemCount = Math.floor(Math.random() * 3) + 1
        const selectedProducts = products
          .sort(() => 0.5 - Math.random())
          .slice(0, itemCount)

        let totalAmount = 0
        const orderItems = selectedProducts.map(product => {
          const quantity = Math.floor(Math.random() * 3) + 1
          const price = product.price
          totalAmount += price * quantity
          
          return {
            productId: product.id,
            quantity,
            price
          }
        })

        // Sipariş durumunu rastgele belirle
        const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
        const status = statuses[Math.floor(Math.random() * statuses.length)]

        const order = await prisma.order.create({
          data: {
            userId: user.id,
            total: totalAmount,
            status,
            items: {
              create: orderItems
            }
          }
        })

        console.log(`✅ Sipariş oluşturuldu: ${user.name} - ₺${totalAmount.toFixed(2)} (${status})`)
      }
    }

    console.log('🎉 Test verileri başarıyla oluşturuldu!')
    console.log('\n📋 Test Hesapları:')
    console.log('👑 Admin: admin@livkors.com / admin123')
    console.log('👤 Kullanıcı 1: user1@test.com / user123')
    console.log('👤 Kullanıcı 2: user2@test.com / user123')
    console.log('👤 Kullanıcı 3: user3@test.com / user123')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData() 