const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('123456', 10)
  const userPassword = await bcrypt.hash('123456', 10)

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      name: 'Normal User',
      password: userPassword,
      role: 'USER'
    }
  })

  // Create additional test users
  const user2 = await prisma.user.upsert({
    where: { email: 'ahmet@test.com' },
    update: {},
    create: {
      email: 'ahmet@test.com',
      name: 'Ahmet Yılmaz',
      password: userPassword,
      role: 'USER'
    }
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'ayse@test.com' },
    update: {},
    create: {
      email: 'ayse@test.com',
      name: 'Ayşe Demir',
      password: userPassword,
      role: 'USER'
    }
  })

  // Create categories
  const womenCategory = await prisma.category.upsert({
    where: { name: "Women's Bags" },
    update: {},
    create: {
      name: "Women's Bags",
      description: "Şık ve modern kadın çantaları"
    }
  })

  const menCategory = await prisma.category.upsert({
    where: { name: "Men's Bags" },
    update: {},
    create: {
      name: "Men's Bags", 
      description: "Erkekler için fonksiyonel çantalar"
    }
  })

  const travelCategory = await prisma.category.upsert({
    where: { name: "Travel Bags" },
    update: {},
    create: {
      name: "Travel Bags",
      description: "Seyahat için özel tasarım çantalar"
    }
  })

  const businessCategory = await prisma.category.upsert({
    where: { name: "Business Bags" },
    update: {},
    create: {
      name: "Business Bags",
      description: "İş hayatı için profesyonel çantalar"
    }
  })

  // Create products
  const products = [
    {
      name: "Elegant Leather Handbag",
      description: "Premium deri kadın çantası, şık tasarımıyla her kombine uyum sağlar. Çok cepli iç yapısı ile günlük eşyalarınızı düzenli taşıyın.",
      price: 599.99,
      stock: 25,
      categoryId: womenCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
    },
    {
      name: "Professional Backpack",
      description: "Laptop bölmeli erkek sırt çantası. Su geçirmez kumaş ve ergonomik tasarım ile iş ve seyahat için ideal.",
      price: 399.99,
      stock: 30,
      categoryId: menCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      name: "Large Travel Duffel",
      description: "Büyük kapasiteli seyahat çantası. Hafif yapısı ve çok cepli tasarımı ile uzun seyahatler için mükemmel.",
      price: 349.99,
      stock: 15,
      categoryId: travelCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      name: "Executive Briefcase",
      description: "Klasik deri evrak çantası. Şirket toplantıları ve önemli buluşmalar için prestijli görünüm sağlar.",
      price: 799.99,
      stock: 12,
      categoryId: businessCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      name: "Trendy Crossbody Bag",
      description: "Modern çapraz askılı kadın çantası. Kompakt yapısı ile günlük kullanım için ideal boyut.",
      price: 199.99,
      stock: 40,
      categoryId: womenCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
    },
    {
      name: "Waterproof Messenger Bag",
      description: "Su geçirmez erkek postacı çantası. Bisikletçiler ve motosikletçiler için özel tasarım.",
      price: 279.99,
      stock: 20,
      categoryId: menCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      name: "Rolling Travel Suitcase",
      description: "Tekerlekli bavul çanta. TSA onaylı kilit sistemi ve genişletilebilir yapı ile seyahat kolaylığı.",
      price: 549.99,
      stock: 18,
      categoryId: travelCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      name: "Laptop Business Tote",
      description: "İş kadınları için laptop çantası. Şık tasarım ve pratik bölmeler ile profesyonel görünüm.",
      price: 449.99,
      stock: 22,
      categoryId: businessCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
    },
    {
      name: "Mini Evening Clutch",
      description: "Gece çantası, özel davetler için. Zarif detayları ve küçük boyutu ile şıklığınızı tamamlar.",
      price: 149.99,
      stock: 35,
      categoryId: womenCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
    },
    {
      name: "Gym Sports Bag",
      description: "Spor çantası, ayakkabı bölmeli. Nemli ve kuru eşyalar için ayrı bölmeler içerir.",
      price: 229.99,
      stock: 28,
      categoryId: menCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      name: "Weekend Travel Bag",
      description: "Hafta sonu kaçamakları için ideal boyutta çanta. Şık tasarım ve fonksiyonel iç düzen.",
      price: 299.99,
      stock: 25,
      categoryId: travelCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
      name: "Professional Portfolio",
      description: "Dosya taşıma çantası. Toplantılar ve sunumlar için dokümanlarınızı düzenli taşıyın.",
      price: 189.99,
      stock: 32,
      categoryId: businessCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    }
  ]

  // Create all products
  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { name: productData.name },
      update: {},
      create: productData
    })
    createdProducts.push(product)
  }

  // Create sample comments
  const comments = [
    {
      content: "Harika bir çanta! Kalitesi çok iyi ve çok şık duruyor. Kesinlikle tavsiye ederim.",
      rating: 5,
      userId: normalUser.id,
      productId: createdProducts[0].id
    },
    {
      content: "Laptop çantası olarak çok pratik. İç bölümleri gayet kullanışlı.",
      rating: 4,
      userId: user2.id,
      productId: createdProducts[1].id
    },
    {
      content: "Seyahat için aldım, çok memnunum. Kapasitesi harika.",
      rating: 5,
      userId: user3.id,
      productId: createdProducts[2].id
    },
    {
      content: "İş toplantılarında çok profesyonel duruyor. Deri kalitesi mükemmel.",
      rating: 5,
      userId: normalUser.id,
      productId: createdProducts[3].id
    },
    {
      content: "Günlük kullanım için ideal boyut. Çok beğendim.",
      rating: 4,
      userId: user2.id,
      productId: createdProducts[4].id
    },
    {
      content: "Su geçirmez özelliği gerçekten işe yarıyor. Bisiklet sürerken çok faydalı.",
      rating: 5,
      userId: user3.id,
      productId: createdProducts[5].id
    },
    {
      content: "Tekerlekleri çok pürüzsüz çalışıyor. Seyahat kolaylığı sağlıyor.",
      rating: 4,
      userId: normalUser.id,
      productId: createdProducts[6].id
    },
    {
      content: "İş hayatında kadınlar için çok praktik bir çanta. Laptop bölümü çok iyi.",
      rating: 5,
      userId: user2.id,
      productId: createdProducts[7].id
    },
    {
      content: "Gece çıkışları için mükemmel. Çok şık ve zarif.",
      rating: 5,
      userId: user3.id,
      productId: createdProducts[8].id
    },
    {
      content: "Spor salonuna giderken çok kullanışlı. Ayakkabı bölümü harika fikir.",
      rating: 4,
      userId: normalUser.id,
      productId: createdProducts[9].id
    },
    {
      content: "Hafta sonu gezileri için ideal boyut. Çok memnunum.",
      rating: 4,
      userId: user2.id,
      productId: createdProducts[10].id
    },
    {
      content: "Dosyalarımı düzenli taşımak için çok iyi. İş hayatında vazgeçilmez.",
      rating: 5,
      userId: user3.id,
      productId: createdProducts[11].id
    },
    // Ek yorumlar
    {
      content: "Fiyat performans açısından çok iyi. Kaliteli malzeme kullanılmış.",
      rating: 4,
      userId: user2.id,
      productId: createdProducts[0].id
    },
    {
      content: "Ergonomik tasarımı sayesinde uzun süre taşımak yormuyor.",
      rating: 5,
      userId: user3.id,
      productId: createdProducts[1].id
    },
    {
      content: "Çok geniş, hemen hemen her şey sığıyor. Seyahat için ideal.",
      rating: 5,
      userId: normalUser.id,
      productId: createdProducts[2].id
    }
  ]

  // Create all comments
  // Note: Comment creation skipped for now - will be added after basic data is loaded
  console.log('Note: Comments will be added in a separate step')

  // Create site settings with social media links
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Livkors',
      siteDescription: 'Kaliteli çantalar ve mükemmel müşteri hizmetinde öncü markayız',
      heroTitle: 'Özel Tasarım Çantalar',
      heroSubtitle: 'Her tarza uygun kaliteli çantalar. Kadın, erkek ve özel koleksiyonlar.',
      footerText: 'Kaliteli çantalar ve mükemmel müşteri hizmetinde öncü markayız.',
      socialFacebook: 'https://facebook.com/livkors',
      socialInstagram: 'https://instagram.com/livkors',
      socialTwitter: 'https://twitter.com/livkors',
      socialLinkedin: 'https://linkedin.com/company/livkors',
      metaTitle: 'Livkors - Kaliteli Çantalar',
      metaDescription: 'En kaliteli çantalar, uygun fiyatlar ve hızlı teslimat'
    }
  })

  // Create about page data
  await prisma.aboutPage.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      title: 'Hakkımızda',
      heroTitle: 'Livkors - Kalite ve Şıklığın Buluştuğu Yer',
      heroSubtitle: '2015 yılından beri kaliteli çanta üretiminde öncü firma',
      storyTitle: 'Hikayemiz',
      storyContent: 'Livkors, 2015 yılında kaliteli çanta üretimi amacıyla kurulmuştur...',
      visionTitle: 'Vizyonumuz',
      visionContent: 'Çanta sektöründe kalite ve tasarım standardlarını belirlemeyi hedefliyoruz...',
      missionTitle: 'Misyonumuz',
      missionContent: 'Müşterilerimize en kaliteli ürünleri sunarak yaşam kalitelerini artırmak...',
      phone: '+90 212 555 0123',
      email: 'info@livkors.com',
      address: 'İstanbul, Türkiye'
    }
  })

  // Create default team members
  const teamMembers = [
    {
      name: 'Ahmet Kaya',
      position: 'Kurucu & CEO',
      description: '15 yıllık moda ve tekstil sektörü deneyimi',
      emoji: '👨‍💼',
      isActive: true,
      order: 0
    },
    {
      name: 'Elif Demir',
      position: 'Tasarım Direktörü',
      description: 'Uluslararası moda akademilerinde eğitim almış',
      emoji: '👩‍🎨',
      isActive: true,
      order: 1
    },
    {
      name: 'Mehmet Özkan',
      position: 'Operasyon Müdürü',
      description: 'Lojistik ve kalite süreçlerinde uzman',
      emoji: '👨‍💻',
      isActive: true,
      order: 2
    }
  ]

  // Check if team members already exist
  const existingMembers = await prisma.teamMember.findMany()
  
  if (existingMembers.length === 0) {
    for (const memberData of teamMembers) {
      await prisma.teamMember.create({
        data: memberData
      })
    }
  }

  console.log('Database seeded successfully!')
  console.log(`Created ${createdProducts.length} products`)
  console.log('Site settings and about page created')
  console.log(`Created ${teamMembers.length} team members`)
  console.log('Comments creation skipped for now')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 