'use server'

import { prisma } from './prisma'
import { getCurrentUser } from './actions'
import { revalidatePath } from 'next/cache'

// Require admin function
async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Bu işlemi gerçekleştirmek için admin yetkisi gerekli')
  }
}

// Get all team members
export async function getTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    return { success: true, data: members }
  } catch (error) {
    console.error('Team members getirilemedi:', error)
    return { success: false, message: 'Team members getirilemedi' }
  }
}

// Get all team members for admin
export async function getAllTeamMembers() {
  await requireAdmin()
  
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })

    return { success: true, data: members }
  } catch (error) {
    console.error('Team members getirilemedi:', error)
    return { success: false, message: 'Team members getirilemedi' }
  }
}

// Create team member
export async function createTeamMember(formData) {
  await requireAdmin()
  
  try {
    const maxOrder = await prisma.teamMember.aggregate({
      _max: { order: true }
    })

    await prisma.teamMember.create({
      data: {
        name: formData.get('name'),
        position: formData.get('position'),
        description: formData.get('description') || null,
        imageUrl: formData.get('imageUrl') || null,
        emoji: formData.get('emoji') || '👤',
        isActive: formData.get('isActive') === 'on',
        order: (maxOrder._max.order || 0) + 1
      }
    })

    revalidatePath('/about')
    revalidatePath('/admin')
    
    return { success: true, message: 'Ekip üyesi başarıyla eklendi' }
  } catch (error) {
    console.error('Ekip üyesi eklenemedi:', error)
    return { success: false, message: 'Ekip üyesi eklenemedi' }
  }
}

// Create team member from object (for seed)
export async function createTeamMemberFromObject(data) {
  await requireAdmin()
  
  try {
    const maxOrder = await prisma.teamMember.aggregate({
      _max: { order: true }
    })

    await prisma.teamMember.create({
      data: {
        name: data.name,
        position: data.position,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        emoji: data.emoji || '👤',
        isActive: data.isActive !== false,
        order: parseInt(data.order) || (maxOrder._max.order || 0) + 1
      }
    })

    revalidatePath('/about')
    revalidatePath('/admin')
    
    return { success: true, message: 'Ekip üyesi başarıyla eklendi' }
  } catch (error) {
    console.error('Ekip üyesi eklenemedi:', error)
    return { success: false, message: 'Ekip üyesi eklenemedi: ' + error.message }
  }
}

// Update team member
export async function updateTeamMember(memberId, formData) {
  await requireAdmin()
  
  try {
    await prisma.teamMember.update({
      where: { id: memberId },
      data: {
        name: formData.get('name'),
        position: formData.get('position'),
        description: formData.get('description') || null,
        imageUrl: formData.get('imageUrl') || null,
        emoji: formData.get('emoji') || '👤',
        isActive: formData.get('isActive') === 'on'
      }
    })

    revalidatePath('/about')
    revalidatePath('/admin')
    
    return { success: true, message: 'Ekip üyesi başarıyla güncellendi' }
  } catch (error) {
    console.error('Ekip üyesi güncellenemedi:', error)
    return { success: false, message: 'Ekip üyesi güncellenemedi' }
  }
}

// Delete team member
export async function deleteTeamMember(memberId) {
  await requireAdmin()
  
  try {
    await prisma.teamMember.delete({
      where: { id: memberId }
    })

    revalidatePath('/about')
    revalidatePath('/admin')
    
    return { success: true, message: 'Ekip üyesi başarıyla silindi' }
  } catch (error) {
    console.error('Ekip üyesi silinemedi:', error)
    return { success: false, message: 'Ekip üyesi silinemedi' }
  }
}

// Reorder team members
export async function reorderTeamMembers(memberIds) {
  await requireAdmin()
  
  try {
    for (let i = 0; i < memberIds.length; i++) {
      await prisma.teamMember.update({
        where: { id: memberIds[i] },
        data: { order: i }
      })
    }

    revalidatePath('/about')
    revalidatePath('/admin')
    
    return { success: true, message: 'Ekip sıralaması güncellendi' }
  } catch (error) {
    console.error('Ekip sıralaması güncellenemedi:', error)
    return { success: false, message: 'Ekip sıralaması güncellenemedi' }
  }
}

// Toggle team member active status
export async function toggleTeamMemberStatus(memberId, isActive) {
  await requireAdmin()
  
  try {
    await prisma.teamMember.update({
      where: { id: memberId },
      data: { isActive }
    })

    revalidatePath('/about')
    revalidatePath('/admin')
    
    return { success: true, message: 'Ekip üyesi durumu güncellendi' }
  } catch (error) {
    console.error('Ekip üyesi durumu güncellenemedi:', error)
    return { success: false, message: 'Ekip üyesi durumu güncellenemedi' }
  }
} 