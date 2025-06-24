const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Unsplash placeholder resimleri (free, yüksek kalite)
const placeholderImages = {
  'Deri El Çantası': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'Spor Çantası': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'İş Çantası': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'Kadın Çantası': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
  'Seyahat Çantası': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
  'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  'Erkek Tişört': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
}

async function updateWithPlaceholders() {
  console.log('Placeholder resimler ekleniyor...')

  try {
    const products = await prisma.product.findMany()
    
    for (const product of products) {
      if (placeholderImages[product.name]) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: placeholderImages[product.name] }
        })
        console.log(`✅ ${product.name} için placeholder resim eklendi`)
      }
    }

    console.log('✅ Placeholder resimler güncellendi!')
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateWithPlaceholders() 