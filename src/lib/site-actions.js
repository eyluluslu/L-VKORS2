'use server'

import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

// Check if user is admin
async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    throw new Error('Token bulunamadı')
  }

  const payload = verifyToken(token)
  
  if (payload.role !== 'ADMIN') {
    throw new Error('Bu işlem için admin yetkisi gereklidir')
  }

  return payload
}

// Site Settings Actions
export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "Livkors",
          siteDescription: "Kaliteli çantalar ve mükemmel müşteri hizmetinde öncü markayız",
          heroTitle: "Özel Tasarım Çantalar",
          heroSubtitle: "Her tarza uygun kaliteli çantalar. Kadın, erkek ve özel koleksiyonlar.",
          footerText: "Kaliteli çantalar ve mükemmel müşteri hizmetinde öncü markayız.",
          metaTitle: "Livkors - Kaliteli Çantalar",
          metaDescription: "En kaliteli çantalar, uygun fiyatlar ve hızlı teslimat"
        }
      })
    }

    return { success: true, data: settings }
  } catch (error) {
    console.error('Site ayarları getirilemedi:', error)
    return { success: false, message: 'Site ayarları getirilemedi' }
  }
}

export async function updateSiteSettings(formData) {
  await requireAdmin()
  
  try {
    const updateData = {
      siteName: formData.get('siteName'),
      siteDescription: formData.get('siteDescription'),
      logoUrl: formData.get('logoUrl') || null,
      heroTitle: formData.get('heroTitle'),
      heroSubtitle: formData.get('heroSubtitle'),
      footerText: formData.get('footerText'),
      socialFacebook: formData.get('socialFacebook') || null,
      socialInstagram: formData.get('socialInstagram') || null,
      socialTwitter: formData.get('socialTwitter') || null,
      socialLinkedin: formData.get('socialLinkedin') || null,
      metaTitle: formData.get('metaTitle'),
      metaDescription: formData.get('metaDescription')
    }

    const settings = await prisma.siteSettings.findFirst()
    
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: updateData
      })
    } else {
      await prisma.siteSettings.create({
        data: updateData
      })
    }

    revalidatePath('/')
    revalidatePath('/admin/settings')
    
    return { success: true, message: 'Site ayarları başarıyla güncellendi' }
  } catch (error) {
    console.error('Site ayarları güncellenemedi:', error)
    return { success: false, message: 'Site ayarları güncellenemedi' }
  }
}

// Hero Banner Actions
export async function getHeroBanners() {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { order: 'asc' }
    })

    return { success: true, data: banners }
  } catch (error) {
    console.error('Bannerlar getirilemedi:', error)
    return { success: false, message: 'Bannerlar getirilemedi' }
  }
}

export async function createHeroBanner(formData) {
  await requireAdmin()
  
  try {
    const maxOrder = await prisma.heroBanner.aggregate({
      _max: { order: true }
    })

    await prisma.heroBanner.create({
      data: {
        title: formData.get('title'),
        subtitle: formData.get('subtitle') || null,
        description: formData.get('description') || null,
        imageUrl: formData.get('imageUrl'),
        isActive: formData.get('isActive') === 'on',
        order: (maxOrder._max.order || 0) + 1
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/banners')
    
    return { success: true, message: 'Banner başarıyla eklendi' }
  } catch (error) {
    console.error('Banner eklenemedi:', error)
    return { success: false, message: 'Banner eklenemedi' }
  }
}

export async function updateHeroBanner(bannerId, formData) {
  await requireAdmin()
  
  try {
    await prisma.heroBanner.update({
      where: { id: bannerId },
      data: {
        title: formData.get('title'),
        subtitle: formData.get('subtitle') || null,
        description: formData.get('description') || null,
        imageUrl: formData.get('imageUrl'),
        isActive: formData.get('isActive') === 'on'
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/banners')
    
    return { success: true, message: 'Banner başarıyla güncellendi' }
  } catch (error) {
    console.error('Banner güncellenemedi:', error)
    return { success: false, message: 'Banner güncellenemedi' }
  }
}

export async function deleteHeroBanner(bannerId) {
  await requireAdmin()
  
  try {
    await prisma.heroBanner.delete({
      where: { id: bannerId }
    })

    revalidatePath('/')
    revalidatePath('/admin/banners')
    
    return { success: true, message: 'Banner başarıyla silindi' }
  } catch (error) {
    console.error('Banner silinemedi:', error)
    return { success: false, message: 'Banner silinemedi' }
  }
}

export async function reorderHeroBanners(bannerIds) {
  await requireAdmin()
  
  try {
    for (let i = 0; i < bannerIds.length; i++) {
      await prisma.heroBanner.update({
        where: { id: bannerIds[i] },
        data: { order: i }
      })
    }

    revalidatePath('/')
    revalidatePath('/admin/banners')
    
    return { success: true, message: 'Banner sıralaması güncellendi' }
  } catch (error) {
    console.error('Banner sıralaması güncellenemedi:', error)
    return { success: false, message: 'Banner sıralaması güncellenemedi' }
  }
}

// New functions for JavaScript object compatibility
export async function createHeroBannerFromObject(data) {
  await requireAdmin()
  
  try {
    const maxOrder = await prisma.heroBanner.aggregate({
      _max: { order: true }
    })

    await prisma.heroBanner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        order: parseInt(data.sortOrder) || (maxOrder._max.order || 0) + 1
      }
    })

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true, message: 'Banner başarıyla eklendi' }
  } catch (error) {
    console.error('Banner eklenemedi:', error)
    return { success: false, message: 'Banner eklenemedi: ' + error.message }
  }
}

export async function updateHeroBannerFromObject(bannerId, data) {
  await requireAdmin()
  
  try {
    await prisma.heroBanner.update({
      where: { id: bannerId },
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        order: parseInt(data.sortOrder)
      }
    })

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true, message: 'Banner başarıyla güncellendi' }
  } catch (error) {
    console.error('Banner güncellenemedi:', error)
    return { success: false, message: 'Banner güncellenemedi: ' + error.message }
  }
} 