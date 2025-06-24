const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedCategories() {
  try {
    console.log('🌱 Kategoriler ekleniyor...')

    // Önce mevcut kategorileri kontrol et
    const existingCategories = await prisma.category.findMany()
    if (existingCategories.length > 0) {
      console.log('✅ Kategoriler zaten mevcut:', existingCategories.length)
      return
    }

    // Demo kategoriler
    const categories = [
      {
        name: 'Kadın Çantaları',
        description: 'Kadınlar için şık ve fonksiyonel çanta modelleri'
      },
      {
        name: 'Erkek Çantaları', 
        description: 'Erkekler için spor ve iş çantaları'
      },
      {
        name: 'Seyahat Çantaları',
        description: 'Tatil ve seyahat için büyük boy çantalar'
      },
      {
        name: 'İş Çantaları',
        description: 'Profesyonel yaşam için evrak çantaları'
      },
      {
        name: 'Spor Çantaları',
        description: 'Spor ve fitness için özel tasarım çantalar'
      },
      {
        name: 'Okul Çantaları',
        description: 'Öğrenciler için rahat ve kullanışlı çantalar'
      }
    ]

    // Kategorileri ekle
    for (const category of categories) {
      const created = await prisma.category.create({
        data: category
      })
      console.log(`✅ Kategori eklendi: ${created.name}`)
    }

    console.log('🎉 Tüm kategoriler başarıyla eklendi!')

  } catch (error) {
    console.error('❌ Kategori ekleme hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Script çalıştır
seedCategories() 