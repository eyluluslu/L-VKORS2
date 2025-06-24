const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedProducts() {
  try {
    console.log('🛍️ Ürünler ekleniyor...')

    // Önce kategorileri al
    const categories = await prisma.category.findMany()
    if (categories.length === 0) {
      console.log('❌ Önce kategoriler eklenmelidir!')
      return
    }

    // Mevcut ürün sayısını kontrol et
    const existingProducts = await prisma.product.findMany()
    if (existingProducts.length > 5) {
      console.log('✅ Ürünler zaten mevcut:', existingProducts.length)
      return
    }

    // Demo ürünler - her kategoriye 3-4 ürün
    const productsByCategory = {
      'Kadın Çantaları': [
        {
          name: 'Elegant Deri Çanta',
          description: 'Şık ve fonksiyonel kadın deri çantası. Günlük kullanım için ideal.',
          price: 299.99,
          stock: 15,
          imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
        },
        {
          name: 'Mini Crossbody Çanta',
          description: 'Küçük ve pratik crossbody çanta. Akşam çıkışları için mükemmel.',
          price: 189.99,
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop'
        },
        {
          name: 'Vintage Omuz Çantası',
          description: 'Retro tarzı vintage omuz çantası. Her kombine uyum sağlar.',
          price: 249.99,
          stock: 12,
          imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop'
        }
      ],
      'Erkek Çantaları': [
        {
          name: 'Deri Evrak Çantası',
          description: 'Profesyonel erkek evrak çantası. İş hayatı için ideal.',
          price: 399.99,
          stock: 8,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
        },
        {
          name: 'Casual Messenger Bag',
          description: 'Günlük kullanım için rahat messenger çanta.',
          price: 229.99,
          stock: 18,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
        }
      ],
      'Seyahat Çantaları': [
        {
          name: 'Büyük Seyahat Çantası',
          description: 'Uzun seyahatler için geniş hacimli çanta.',
          price: 499.99,
          stock: 6,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
        },
        {
          name: 'Tekerlekli Valiz Çanta',
          description: 'Pratik tekerlekli seyahat çantası.',
          price: 599.99,
          stock: 4,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
        }
      ],
      'Spor Çantaları': [
        {
          name: 'Spor Duffle Bag',
          description: 'Spor salonu için kullanışlı duffle çanta.',
          price: 149.99,
          stock: 20,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
        }
      ]
    }

    let totalAdded = 0

    for (const category of categories) {
      const products = productsByCategory[category.name] || []
      
      for (const productData of products) {
        const product = await prisma.product.create({
          data: {
            ...productData,
            categoryId: category.id
          }
        })
        console.log(`✅ Ürün eklendi: ${product.name} (${category.name})`)
        totalAdded++
      }
    }

    console.log(`🎉 Toplam ${totalAdded} ürün başarıyla eklendi!`)

  } catch (error) {
    console.error('❌ Ürün ekleme hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Script çalıştır
seedProducts() 