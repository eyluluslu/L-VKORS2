const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    
    console.log('📊 Database Status:');
    console.log('Users:', userCount);
    console.log('Products:', productCount);
    console.log('Categories:', categoryCount);
    
    if (userCount === 0) {
      console.log('❌ Database is empty - need to seed');
      return false;
    } else {
      console.log('✅ Database has data - ready to use');
      return true;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 