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

// User Management Actions
export async function getAllUsers() {
  await requireAdmin()
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            sentMessages: true,
            receivedMessages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, users }
  } catch (error) {
    console.error('Kullanıcılar getirilemedi:', error)
    return { success: false, message: 'Kullanıcılar getirilemedi' }
  }
}

export async function deleteUser(userId) {
  const adminUser = await requireAdmin()
  
  // Admin kendi kendini silemez
  if (adminUser.userId === userId) {
    return { success: false, message: 'Kendi hesabınızı silemezsiniz' }
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    })

    revalidatePath('/admin/users')
    return { success: true, message: 'Kullanıcı başarıyla silindi' }
  } catch (error) {
    console.error('Kullanıcı silinemedi:', error)
    return { success: false, message: 'Kullanıcı silinemedi' }
  }
}

export async function changeUserRole(userId, newRole) {
  const adminUser = await requireAdmin()
  
  // Admin kendi rolünü değiştiremez
  if (adminUser.userId === userId) {
    return { success: false, message: 'Kendi rolünüzü değiştiremezsiniz' }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })

    revalidatePath('/admin/users')
    return { success: true, message: 'Kullanıcı rolü güncellendi' }
  } catch (error) {
    console.error('Kullanıcı rolü güncellenemedi:', error)
    return { success: false, message: 'Kullanıcı rolü güncellenemedi' }
  }
}

// Order Management Actions
export async function getAllOrders() {
  await requireAdmin()
  
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, orders }
  } catch (error) {
    console.error('Siparişler getirilemedi:', error)
    return { success: false, message: 'Siparişler getirilemedi' }
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  await requireAdmin()
  
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    })

    revalidatePath('/admin/orders')
    return { success: true, message: 'Sipariş durumu güncellendi' }
  } catch (error) {
    console.error('Sipariş durumu güncellenemedi:', error)
    return { success: false, message: 'Sipariş durumu güncellenemedi' }
  }
}

// Dashboard Statistics
export async function getDashboardStats() {
  await requireAdmin()
  
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total orders
      prisma.order.count(),
      
      // Total products
      prisma.product.count(),
      
      // Total revenue
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          status: {
            in: ['CONFIRMED', 'SHIPPED', 'DELIVERED']
          }
        }
      }),
      
      // Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true
        },
        _avg: {
          price: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      })
    ])

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            imageUrl: true,
            price: true
          }
        })
        return {
          ...product,
          totalSold: item._sum.quantity,
          avgPrice: item._avg.price
        }
      })
    )

    return {
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue._sum.total || 0,
        recentOrders,
        topProducts: topProductsWithDetails
      }
    }
  } catch (error) {
    console.error('Dashboard istatistikleri getirilemedi:', error)
    return { success: false, message: 'Dashboard istatistikleri getirilemedi' }
  }
} 