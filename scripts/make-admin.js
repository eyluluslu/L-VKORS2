const { PrismaClient } = require('@prisma/client')

async function makeAdmin() {
  const prisma = new PrismaClient()
  
  try {
    console.log('👥 Mevcut kullanıcılar:')
    
    // Tüm kullanıcıları listele
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    console.log('\n📋 Kullanıcı listesi:')
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Rol: ${user.role}`)
    })
    
    // Mevcut admin sayısını kontrol et
    const adminUsers = users.filter(u => u.role === 'ADMIN')
    
    if (adminUsers.length > 1) {
      console.log('\n⚠️  Birden fazla admin bulundu! Sadece bir admin kalacak şekilde düzenleniyor...')
      
      // İlk admin hariç diğerlerini USER yap
      const adminsToDowngrade = adminUsers.slice(1)
      
      for (const admin of adminsToDowngrade) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { role: 'USER' }
        })
        console.log(`🔻 ${admin.email} kullanıcı rolüne geçirildi`)
      }
      
      console.log(`\n✅ Sadece ${adminUsers[0].email} admin olarak kaldı`)
      
    } else if (adminUsers.length === 1) {
      console.log(`\n✅ Sistem zaten düzgün: ${adminUsers[0].email} tek admin`)
      
    } else if (adminUsers.length === 0) {
      // Hiç admin yok, ilk kullanıcıyı admin yap
      if (users.length > 0) {
        const firstUser = users[0]
        await prisma.user.update({
          where: { id: firstUser.id },
          data: { role: 'ADMIN' }
        })
        console.log(`\n🔺 ${firstUser.email} admin yapıldı (ilk kullanıcı)`)
      } else {
        console.log('\n❌ Hiç kullanıcı bulunamadı!')
      }
    }
    
    console.log('\n🎉 İşlem tamamlandı!')
    console.log('📋 Sistem kuralları:')
    console.log('   • Sadece bir admin olabilir')
    console.log('   • Admin rolü değiştirilemez')
    console.log('   • Yeni admin atanamaz')
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin() 