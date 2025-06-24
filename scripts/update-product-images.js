const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Örnek çanta resimleri (eğer bu dosyalar public/products klasöründe varsa)
const productImages = {
  'iPhone 15': '/products/phone1.jpg',
  'Samsung Galaxy S24': '/products/phone2.jpg',
  'Erkek Tişört': '/products/tshirt1.jpg',
  'Deri El Çantası': '/products/canta1.jpg',
  'Spor Çantası': '/products/spor-canta.jpg',
  'İş Çantası': '/products/is-cantasi.jpg',
  'Kadın Çantası': '/products/kadin-canta.jpg',
  'Seyahat Çantası': '/products/seyahat-canta.jpg'
}

async function updateProductImages() {
  console.log('Ürün resimlerini güncelleniyor...')

  try {
    // Tüm ürünleri getir
    const products = await prisma.product.findMany()
    
    for (const product of products) {
      // Eğer ürün için resim tanımlandıysa güncelle
      if (productImages[product.name]) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: productImages[product.name] }
        })
        console.log(`✅ ${product.name} için resim eklendi: ${productImages[product.name]}`)
      } else {
        // Varsayılan resim ata
        const defaultImage = '/products/default-product.jpg'
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: defaultImage }
        })
        console.log(`📷 ${product.name} için varsayılan resim eklendi`)
      }
    }

    console.log('✅ Ürün resimleri başarıyla güncellendi!')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Yeni çanta ürünleri ekle
async function addBagProducts() {
  console.log('Yeni çanta ürünleri ekleniyor...')

  try {
    // Çanta kategorisi bul veya oluştur
    let bagCategory = await prisma.category.findFirst({
      where: { name: 'Çantalar' }
    })

    if (!bagCategory) {
      bagCategory = await prisma.category.create({
        data: {
          name: 'Çantalar',
          description: 'Kadın ve erkek çantaları'
        }
      })
    }

    // Çanta ürünleri
    const bagProducts = [
      {
        name: 'Deri El Çantası',
        description: '100% gerçek deri, el yapımı kadın çantası',
        price: 299.99,
        stock: 15,
        imageUrl: '/products/canta1.jpg',
        categoryId: bagCategory.id
      },
      {
        name: 'Spor Çantası',
        description: 'Su geçirmez spor çantası, büyük kapasiteli',
        price: 89.99,
        stock: 25,
        imageUrl: '/products/spor-canta.jpg',
        categoryId: bagCategory.id
      },
      {
        name: 'İş Çantası',
        description: 'Profesyonel iş çantası, laptop bölmeli',
        price: 189.99,
        stock: 20,
        imageUrl: '/products/is-cantasi.jpg',
        categoryId: bagCategory.id
      },
      {
        name: 'Kadın Çantası',
        description: 'Şık ve modern kadın çantası, günlük kullanım',
        price: 149.99,
        stock: 30,
        imageUrl: '/products/kadin-canta.jpg',
        categoryId: bagCategory.id
      },
      {
        name: 'Seyahat Çantası',
        description: 'Büyük seyahat çantası, tekerlekli',
        price: 249.99,
        stock: 10,
        imageUrl: '/products/seyahat-canta.jpg',
        categoryId: bagCategory.id
      }
    ]

    for (const product of bagProducts) {
      try {
        await prisma.product.create({
          data: product
        })
        console.log(`✅ ${product.name} eklendi`)
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ ${product.name} zaten mevcut`)
        } else {
          console.error(`❌ ${product.name} eklenirken hata:`, error.message)
        }
      }
    }

    console.log('✅ Çanta ürünleri eklendi!')

  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

async function main() {
  await addBagProducts()
  await updateProductImages()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 