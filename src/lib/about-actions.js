'use server'

import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

// Check if user is admin for about page management
async function requireAdmin() {
  console.log('requireAdmin: Yetki kontrolü başlıyor')
  
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    console.log('requireAdmin: Token bulunamadı')
    throw new Error('Token bulunamadı')
  }

  console.log('requireAdmin: Token bulundu, doğrulanıyor...')
  const payload = verifyToken(token)
  
  console.log('requireAdmin: Token payload:', payload)
  
  if (!payload) {
    console.log('requireAdmin: Geçersiz token')
    throw new Error('Geçersiz token')
  }
  
  if (payload.role !== 'ADMIN') {
    console.log('requireAdmin: Admin yetkisi yok, rol:', payload.role)
    throw new Error('Bu işlem için admin yetkisi gereklidir')
  }

  console.log('requireAdmin: Admin yetkisi doğrulandı')
  return payload
}

// Get about page data
export async function getAboutPageData() {
  try {
    let aboutPage = await prisma.aboutPage.findFirst()
    
    // If no about page exists, create default one
    if (!aboutPage) {
      aboutPage = await prisma.aboutPage.create({
        data: {
          title: "Hakkımızda",
          heroTitle: "Livkors - Kalite ve Şıklığın Buluştuğu Yer",
          heroSubtitle: "2015 yılından beri kaliteli çanta üretiminde öncü firma",
          storyTitle: "Hikayemiz",
          storyContent: `Livkors, 2015 yılında kaliteli çanta üretimi amacıyla kurulmuştur. Kurucumuz Ahmet Çanta'nın 20 yıllık sektör deneyimi ile başlayan bu yolculuk, bugün binlerce mutlu müşterimiz ile devam etmektedir.

İlk atölyemizi İstanbul'da 10 kişilik küçük bir ekiple kurduk. Bugün ise 150 kişilik profesyonel ekibimizle, modern üretim tesisimizde günde 500 çanta üretim kapasitesine ulaştık.

Her zaman kaliteyi ön planda tutarak, müşteri memnuniyetini hedefledik. Bu prensiplerimiz sayesinde sektörde güvenilir bir marka haline geldik.`,
          visionTitle: "Vizyonumuz",
          visionContent: `Çanta sektöründe kalite ve tasarım standardlarını belirlemeyi hedefliyoruz. Türkiye'nin önde gelen çanta markası olarak, uluslararası pazarlarda da tanınan bir marka olmayı amaçlıyoruz.

Sürdürülebilir üretim anlayışı ile çevreye duyarlı ürünler geliştirerek, gelecek nesillere daha yaşanabilir bir dünya bırakmak istiyoruz.`,
          missionTitle: "Misyonumuz",
          missionContent: `Müşterilerimize en kaliteli ürünleri sunarak yaşam kalitelerini artırmak temel misyonumuzdur. Her yaş ve zevke uygun çanta tasarımları ile insanların günlük yaşamlarına değer katıyoruz.

Çalışanlarımızın gelişimini destekleyerek, mutlu bir işyeri ortamı oluşturmaya odaklanıyoruz. Toplumsal sorumluluk projelerimizle de sosyal fayda yaratmayı hedefliyoruz.`,
          phone: "+90 212 555 0123",
          email: "info@livkors.com",
          address: "Merkez Mah. Çanta Sok. No:42 Beyoğlu, İstanbul"
        }
      })
    }

    return { success: true, data: aboutPage }
  } catch (error) {
    console.error('About page verisi getirilemedi:', error)
    return { success: false, message: 'About page verisi getirilemedi' }
  }
}

// Update about page (admin only)
export async function updateAboutPage(formData) {
  console.log('updateAboutPage: Fonksiyon başladı')
  
  try {
    await requireAdmin()
    console.log('updateAboutPage: Admin yetkisi doğrulandı')
    const updateData = {
      title: formData.get('title'),
      heroTitle: formData.get('heroTitle'),
      heroSubtitle: formData.get('heroSubtitle'),
      storyTitle: formData.get('storyTitle'),
      storyContent: formData.get('storyContent'),
      visionTitle: formData.get('visionTitle'),
      visionContent: formData.get('visionContent'),
      missionTitle: formData.get('missionTitle'),
      missionContent: formData.get('missionContent'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address')
    }
    
    console.log('updateAboutPage: Update data hazırlandı:', updateData)

    // Get the first (and should be only) about page
    const aboutPage = await prisma.aboutPage.findFirst()
    
    if (aboutPage) {
      await prisma.aboutPage.update({
        where: { id: aboutPage.id },
        data: updateData
      })
    } else {
      await prisma.aboutPage.create({
        data: updateData
      })
    }

    revalidatePath('/about')
    revalidatePath('/admin/about')
    
    return { success: true, message: 'Hakkımızda sayfası başarıyla güncellendi' }
  } catch (error) {
    console.error('About page güncellenemedi:', error)
    return { success: false, message: 'About page güncellenemedi' }
  }
} 