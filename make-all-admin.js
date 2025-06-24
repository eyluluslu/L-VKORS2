const { PrismaClient } = require('@prisma/client')

async function makeAllAdmin() {
  const prisma = new PrismaClient()
  
  try {
    const result = await prisma.user.updateMany({
      where: { role: 'USER' },
      data: { role: 'ADMIN' }
    })
    
    console.log(`✅ ${result.count} kullanıcı admin yapıldı!`)
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makeAllAdmin() 