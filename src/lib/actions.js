'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const sqlite = require('./sqlite')

// ============ AUTH ACTIONS ============

export async function loginAction(prevState, formData) {
  try {
    console.log('Login attempt with formData:', formData)
    const email = formData.get('email')
    const password = formData.get('password')

    console.log('Email:', email)
    console.log('Password length:', password ? password.length : 0)

    if (!email || !password) {
      console.log('Missing email or password')
      return { error: 'Email ve şifre gerekli' }
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('User found:', user ? 'Yes' : 'No')

    if (!user) {
      return { error: 'Geçersiz email veya şifre' }
    }

    // Şifreyi doğrula
    const isPasswordValid = await verifyPassword(password, user.password)
    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return { error: 'Geçersiz email veya şifre' }
    }

    // Token oluştur ve cookie'ye set et
    const token = generateToken(user.id, user.role)
    console.log('Token generated:', token ? 'Yes' : 'No')
    
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 gün
    })

    console.log('Cookie set successfully')

    // Rolüne göre yönlendir
    if (user.role === 'ADMIN') {
      redirect('/admin')
    } else {
      redirect('/')
    }

  } catch (error) {
    console.error('Login error details:', error)
    return { error: 'Sunucu hatası: ' + error.message }
  }
}

export async function registerAction(prevState, formData) {
  try {
    console.log('Register attempt with formData:', formData)
    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')

    console.log('Email:', email)
    console.log('Name:', name)
    console.log('Password length:', password ? password.length : 0)

    if (!email || !password || !name) {
      console.log('Missing required fields')
      return { error: 'Tüm alanlar gerekli' }
    }

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    console.log('Existing user check:', existingUser ? 'Found' : 'Not found')

    if (existingUser) {
      return { error: 'Bu email adresi zaten kayıtlı' }
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password)
    console.log('Password hashed successfully')

    // Kullanıcıyı oluştur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      }
    })

    console.log('User created successfully:', newUser.id)

    return { success: 'Kullanıcı başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.' }

  } catch (error) {
    console.error('Register error details:', error)
    return { error: 'Sunucu hatası: ' + error.message }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  redirect('/')
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// ============ ADMIN ACTIONS ============

async function verifyAdmin() {
  try {
    console.log('VerifyAdmin called')
    const user = await getCurrentUser()
    console.log('Current user in verifyAdmin:', user ? { id: user.id, role: user.role } : 'No user')
    
    if (!user || user.role !== 'ADMIN') {
      console.log('Access denied - not admin')
      redirect('/login')
    }
    
    console.log('Admin verification successful')
    return user
  } catch (error) {
    console.error('VerifyAdmin error:', error)
    redirect('/login')
  }
}

export async function getProducts() {
  await verifyAdmin()
  
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return products
  } catch (error) {
    console.error('Get products error:', error)
    return []
  }
}

export async function createProduct(formData) {
  try {
    console.log('CreateProduct called with formData:', formData)
    await verifyAdmin()

    const name = formData.get('name')
    const description = formData.get('description')
    const price = formData.get('price')
    const imageUrl = formData.get('imageUrl')
    const stock = formData.get('stock')
    const categoryId = formData.get('categoryId')

    console.log('Product data:', { name, description, price, imageUrl, stock, categoryId })

    if (!name || !price || !categoryId) {
      return { error: 'İsim, fiyat ve kategori gerekli' }
    }

    // Check if a product with the same name already exists
    const existingProduct = await prisma.product.findUnique({
      where: { name: name }
    })

    if (existingProduct) {
      return { error: `"${name}" isimli bir ürün zaten var. Lütfen farklı bir isim kullanın.` }
    }

    const createdProduct = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        stock: parseInt(stock) || 0,
        categoryId
      }
    })

    console.log('Product created successfully:', createdProduct)
    revalidatePath('/admin')
    return { success: 'Ürün başarıyla eklendi!' }

  } catch (error) {
    console.error('Create product error details:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    // Handle unique constraint error specifically
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return { error: 'Bu ürün adı zaten kullanılıyor. Lütfen farklı bir isim seçin.' }
    }
    
    return { error: 'Ürün eklenirken bir hata oluştu: ' + error.message }
  }
}

export async function updateProduct(id, formData) {
  try {
    console.log('UpdateProduct called with id:', id, 'formData:', formData)
    await verifyAdmin()

    const name = formData.get('name')
    const description = formData.get('description')
    const price = formData.get('price')
    const imageUrl = formData.get('imageUrl')
    const stock = formData.get('stock')
    const categoryId = formData.get('categoryId')

    console.log('Update data:', { name, description, price, imageUrl, stock, categoryId })

    // Check if another product with the same name exists (excluding current product)
    const existingProduct = await prisma.product.findUnique({
      where: { name: name }
    })

    if (existingProduct && existingProduct.id !== id) {
      return { error: `"${name}" isimli başka bir ürün zaten var. Lütfen farklı bir isim kullanın.` }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        stock: parseInt(stock) || 0,
        categoryId
      }
    })

    console.log('Product updated successfully:', updatedProduct)
    revalidatePath('/admin')
    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath('/')
    return { success: 'Ürün başarıyla güncellendi!' }

  } catch (error) {
    console.error('Update product error details:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    // Handle unique constraint error specifically
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return { error: 'Bu ürün adı zaten kullanılıyor. Lütfen farklı bir isim seçin.' }
    }
    
    return { error: 'Ürün güncellenirken bir hata oluştu: ' + error.message }
  }
}

export async function deleteProduct(id) {
  await verifyAdmin()

  try {
    await prisma.product.delete({
      where: { id }
    })

    revalidatePath('/admin')
    return { success: 'Ürün başarıyla silindi!' }

  } catch (error) {
    console.error('Delete product error:', error)
    return { error: 'Ürün silinirken bir hata oluştu' }
  }
}

export async function getCategories() {
  await verifyAdmin()
  
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return categories
  } catch (error) {
    console.error('Get categories error:', error)
    return []
  }
}

export async function createCategory(formData) {
  await verifyAdmin()

  const name = formData.get('name')
  const description = formData.get('description')

  if (!name) {
    return { error: 'Kategori adı gerekli' }
  }

  try {
    await prisma.category.create({
      data: {
        name,
        description: description || null
      }
    })

    revalidatePath('/admin')
    return { success: 'Kategori başarıyla eklendi!' }

  } catch (error) {
    console.error('Create category error:', error)
    return { error: 'Kategori eklenirken bir hata oluştu' }
  }
}

export async function updateCategory(id, formData) {
  await verifyAdmin()

  const name = formData.get('name')
  const description = formData.get('description')

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null
      }
    })

    revalidatePath('/admin')
    return { success: 'Kategori başarıyla güncellendi!' }

  } catch (error) {
    console.error('Update category error:', error)
    return { error: 'Kategori güncellenirken bir hata oluştu' }
  }
}

export async function deleteCategory(id) {
  await verifyAdmin()

  try {
    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/admin')
    return { success: 'Kategori başarıyla silindi!' }

  } catch (error) {
    console.error('Delete category error:', error)
    return { error: 'Kategori silinirken bir hata oluştu' }
  }
}

// ============ PUBLIC ACTIONS ============

export async function getPublicProducts(categoryId = null) {
  try {
    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return products
  } catch (error) {
    console.error('Get public products error:', error)
    return []
  }
}

export async function getPublicCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    // Debug: Kategoriler varsa ilk birini logla
    if (categories.length > 0) {
      console.log('✅ Categories found:', categories.length, 'First category:', categories[0].name)
    } else {
      console.log('⚠️ No categories found in database')
    }
    
    return categories
  } catch (error) {
    console.error('❌ Get public categories error:', error)
    return []
  }
}

export async function getProductsByCategory(categoryId) {
  try {
    console.log('🔍 getProductsByCategory called with ID:', categoryId)
    
    // Önce kategoriyi kontrol et
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } }
    })
    
    console.log('📂 Category found:', category)
    
    if (!category) {
      console.log('❌ Category not found for ID:', categoryId)
      return []
    }
    
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId
      },
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log('🛍️ Found products:', products.length)
    return products
  } catch (error) {
    console.error('❌ Get products by category error:', error)
    return []
  }
}

// ============ MESSAGING ACTIONS ============

export async function sendMessage(prevState, formData) {
  try {
    console.log('=== SEND MESSAGE START (SQLite) ===')
    
    const user = await getCurrentUser()
    console.log('Current user:', user)
    
    if (!user) {
      console.log('No user found, redirecting to login')
      redirect('/login')
    }

    const receiverEmail = formData.get('receiverEmail')
    const subject = formData.get('subject')
    const content = formData.get('content')

    console.log('Form data values:', { receiverEmail, subject, content })

    if (!receiverEmail || !subject || !content) {
      console.log('Missing required fields')
      return { error: 'Tüm alanlar gerekli' }
    }

    // Alıcıyı bul
    console.log('Finding receiver with email:', receiverEmail)
    const receiver = await sqlite.findUserByEmail(receiverEmail)

    console.log('Receiver found:', receiver)

    if (!receiver) {
      console.log('Receiver not found')
      return { error: 'Belirtilen email adresine sahip kullanıcı bulunamadı' }
    }

    if (receiver.id === user.id) {
      console.log('Cannot send message to self')
      return { error: 'Kendinize mesaj gönderemezsiniz' }
    }

    // Message tablosunu başlat
    await sqlite.initMessageTable()
    
    // Mesajı oluştur
    console.log('Creating message with SQLite')
    const newMessage = await sqlite.createMessage({
      subject,
      content,
      senderId: user.id,
      receiverId: receiver.id
    })

    console.log('Message created successfully:', newMessage)
    console.log('=== SEND MESSAGE END ===')

    return { success: 'Mesaj başarıyla gönderildi!' }

  } catch (error) {
    console.error('=== SEND MESSAGE ERROR ===')
    console.error('Error details:', error)
    console.error('Error message:', error.message)
    console.error('=== SEND MESSAGE ERROR END ===')
    return { error: 'Mesaj gönderilirken bir hata oluştu: ' + error.message }
  }
}

export async function getMessages() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return []
    }

    await sqlite.initMessageTable()
    
    const [inboxMessages, sentMessages] = await Promise.all([
      sqlite.getInboxMessages(user.id),
      sqlite.getSentMessages(user.id)
    ])

    return [...inboxMessages, ...sentMessages].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  } catch (error) {
    console.error('Get messages error:', error)
    return []
  }
}

export async function getInboxMessages() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return []
    }

    await sqlite.initMessageTable()
    return await sqlite.getInboxMessages(user.id)
  } catch (error) {
    console.error('Get inbox messages error:', error)
    return []
  }
}

export async function getSentMessages() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return []
    }

    await sqlite.initMessageTable()
    return await sqlite.getSentMessages(user.id)
  } catch (error) {
    console.error('Get sent messages error:', error)
    return []
  }
}

export async function markMessageAsRead(messageId) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }

    await sqlite.initMessageTable()
    const success = await sqlite.markAsRead(messageId, user.id)
    
    if (success) {
      revalidatePath('/messages')
      return { success: 'Mesaj okundu olarak işaretlendi' }
    } else {
      return { error: 'Mesaj işaretlenirken bir hata oluştu' }
    }

  } catch (error) {
    console.error('Mark message as read error:', error)
    return { error: 'Mesaj işaretlenirken bir hata oluştu' }
  }
}

export async function deleteMessage(messageId) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }

    await sqlite.initMessageTable()
    const success = await sqlite.deleteMessage(messageId, user.id)
    
    if (success) {
      revalidatePath('/messages')
      return { success: 'Mesaj silindi' }
    } else {
      return { error: 'Mesaj silinirken bir hata oluştu' }
    }

  } catch (error) {
    console.error('Delete message error:', error)
    return { error: 'Mesaj silinirken bir hata oluştu' }
  }
}

// ============ CART ACTIONS ============

export async function addToCart(prevState, formData) {
  try {
    console.log('AddToCart called with formData:', formData)
    const user = await getCurrentUser()
    console.log('Current user:', user ? user.id : 'No user')
    
    if (!user) {
      redirect('/login')
    }

    const productId = formData.get('productId')
    const quantity = parseInt(formData.get('quantity') || '1')
    
    console.log('ProductId:', productId, 'Quantity:', quantity)

    if (!productId) {
      return { error: 'Ürün ID gerekli' }
    }

    // Ürünü kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return { error: 'Ürün bulunamadı' }
    }

    if (product.stock < quantity) {
      return { error: 'Yetersiz stok' }
    }

    // Kullanıcının sepetini bul veya oluştur
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id }
      })
    }

    // Sepette bu ürün var mı kontrol et
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    })

    if (existingCartItem) {
      // Mevcut miktarı artır
      const newQuantity = existingCartItem.quantity + quantity
      
      if (product.stock < newQuantity) {
        return { error: 'Sepete eklemek istediğiniz miktar stok miktarını aşıyor' }
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      // Yeni öğe ekle
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      })
    }

    revalidatePath('/cart')
    revalidatePath('/')
    return { success: 'Ürün sepete eklendi!' }

  } catch (error) {
    console.error('Add to cart error details:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return { error: 'Sepete eklenirken bir hata oluştu: ' + error.message }
  }
}

export async function updateCartItemQuantity(prevState, formData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }

    const cartItemId = formData.get('cartItemId')
    const quantity = parseInt(formData.get('quantity'))

    if (!cartItemId || !quantity || quantity < 1) {
      return { error: 'Geçersiz miktar' }
    }

    // Sepet öğesini ve ürünü getir
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true
      }
    })

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return { error: 'Sepet öğesi bulunamadı' }
    }

    if (cartItem.product.stock < quantity) {
      return { error: 'Yetersiz stok' }
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity }
    })

    revalidatePath('/cart')
    return { success: 'Miktar güncellendi' }

  } catch (error) {
    console.error('Update cart item error:', error)
    return { error: 'Miktar güncellenirken bir hata oluştu' }
  }
}

export async function removeFromCart(cartItemId) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }

    // Sepet öğesini kontrol et
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    })

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return { error: 'Sepet öğesi bulunamadı' }
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    revalidatePath('/cart')
    return { success: 'Ürün sepetten çıkarıldı' }

  } catch (error) {
    console.error('Remove from cart error:', error)
    return { error: 'Sepetten çıkarılırken bir hata oluştu' }
  }
}

export async function getCartItems() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return []
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return cart?.items || []
  } catch (error) {
    console.error('Get cart items error:', error)
    return []
  }
}

export async function getCartCount() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return 0
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: true
      }
    })

    return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0
  } catch (error) {
    console.error('Get cart count error:', error)
    return 0
  }
}

export async function clearCart(prevState, formData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

    revalidatePath('/cart')
    return { success: 'Sepet temizlendi' }

  } catch (error) {
    console.error('Clear cart error:', error)
    return { error: 'Sepet temizlenirken bir hata oluştu' }
  }
}

// ============ PROFILE ACTIONS ============

export async function updateProfile(profileData) {
  console.log('updateProfile: Fonksiyon başladı, gelen data:', profileData)
  
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.log('updateProfile: Kullanıcı girişi yok')
      return { error: 'Kullanıcı girişi gerekli' }
    }

    console.log('updateProfile: Mevcut kullanıcı:', { id: user.id, name: user.name, email: user.email })
    console.log('updateProfile: Cookies test...', process.env.NODE_ENV)

    const { name, email } = profileData

    console.log('updateProfile: Güncelleme verileri:', { name, email })

    if (!name || !email) {
      console.log('updateProfile: Ad veya email boş')
      return { error: 'Ad ve email alanları gerekli' }
    }

    // Email başka kullanıcı tarafından kullanılıyor mu kontrol et
    if (email !== user.email) {
      console.log('updateProfile: Email değiştirildi, çakışma kontrolü yapılıyor...', { oldEmail: user.email, newEmail: email })
      
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        console.log('updateProfile: Email zaten kullanımda')
        return { error: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor' }
      }
    }

    console.log('updateProfile: Veritabanı güncelleme başlıyor...')

    // Kullanıcı bilgilerini güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        updatedAt: new Date()
      }
    })

    console.log('updateProfile: Veritabanı başarıyla güncellendi:', { 
      id: updatedUser.id, 
      name: updatedUser.name, 
      email: updatedUser.email 
    })

    revalidatePath('/profile')
    revalidatePath('/')
    
    console.log('updateProfile: Cache temizlendi, işlem tamamlandı')
    return { success: 'Profil başarıyla güncellendi' }

  } catch (error) {
    console.error('updateProfile: Hata oluştu:', error)
    return { error: 'Profil güncellenirken bir hata oluştu: ' + error.message }
  }
}

export async function updatePassword(passwordData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'Kullanıcı girişi gerekli' }
    }

    console.log('updatePassword: Fonksiyon başladı, kullanıcı:', user.id)

    const { currentPassword, newPassword, confirmPassword } = passwordData

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: 'Tüm şifre alanları gerekli' }
    }

    if (newPassword !== confirmPassword) {
      return { error: 'Yeni şifre ve onay şifresi eşleşmiyor' }
    }

    if (newPassword.length < 6) {
      return { error: 'Yeni şifre en az 6 karakter olmalıdır' }
    }

    // Mevcut kullanıcı bilgilerini al
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!currentUser) {
      return { error: 'Kullanıcı bulunamadı' }
    }

    console.log('updatePassword: Kullanıcı bulundu, şifre kontrol ediliyor...')

    // Mevcut şifreyi kontrol et
    const bcrypt = require('bcryptjs')
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password)

    if (!isCurrentPasswordValid) {
      console.log('updatePassword: Mevcut şifre yanlış')
      return { error: 'Mevcut şifre yanlış' }
    }

    console.log('updatePassword: Mevcut şifre doğru, yeni şifre hashleniyor...')

    // Yeni şifreyi hashle
    const saltRounds = 10
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    console.log('updatePassword: Yeni şifre hashlendi, veritabanı güncelleniyor...')

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    console.log('updatePassword: Şifre başarıyla güncellendi')

    revalidatePath('/profile')
    return { success: 'Şifre başarıyla değiştirildi' }

  } catch (error) {
    console.error('Update password error:', error)
    return { error: 'Şifre değiştirilirken bir hata oluştu' }
  }
}

// ============ ADVANCED ADMIN ACTIONS ============

export async function getAllUsers() {
  await verifyAdmin()
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
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
    return users
  } catch (error) {
    console.error('Get all users error:', error)
    return []
  }
}

export async function getAdminStats() {
  await verifyAdmin()
  
  try {
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalMessages,
      recentUsers,
      recentOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.message.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Son 30 gün
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Son 30 gün
          }
        }
      })
    ])

    // Rol dağılımı
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    })

    return {
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalMessages,
      recentUsers,
      recentOrders,
      roleStats: roleStats.reduce((acc, stat) => {
        acc[stat.role] = stat._count.id
        return acc
      }, {})
    }
  } catch (error) {
    console.error('Get admin stats error:', error)
    return {}
  }
}

export async function deleteUser(userId) {
  const currentUser = await verifyAdmin()
  
  try {
    // Kendi hesabını silemez
    if (currentUser.id === userId) {
      return { error: 'Kendi hesabınızı silemezsiniz' }
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userToDelete) {
      return { error: 'Kullanıcı bulunamadı' }
    }

    // Admin olan kullanıcılar silinemez
    if (userToDelete.role === 'ADMIN') {
      return { error: 'Admin rolündeki kullanıcılar silinemez!' }
    }

    // Kullanıcıyı sil (cascade ile ilişkili veriler de silinir)
    await prisma.user.delete({
      where: { id: userId }
    })

    revalidatePath('/admin')
    return { success: 'Kullanıcı başarıyla silindi' }

  } catch (error) {
    console.error('Delete user error:', error)
    return { error: 'Kullanıcı silinirken bir hata oluştu' }
  }
}

export async function changeUserRole(userId, newRole) {
  const currentUser = await verifyAdmin()
  
  try {
    // Kendi rolünü değiştiremez
    if (currentUser.id === userId) {
      return { error: 'Kendi rolünüzü değiştiremezsiniz' }
    }

    // Sadece USER rolüne değişiklik yapılabilir (sadece bir admin olacak)
    if (newRole === 'ADMIN') {
      return { error: 'Sistemde sadece bir admin olabilir!' }
    }

    if (!['USER'].includes(newRole)) {
      return { error: 'Geçersiz rol' }
    }

    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userToUpdate) {
      return { error: 'Kullanıcı bulunamadı' }
    }

    // Admin olan kullanıcının rolü değiştirilemez
    if (userToUpdate.role === 'ADMIN') {
      return { error: 'Admin rolündeki kullanıcıların rolü değiştirilemez!' }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { 
        role: newRole,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin')
    return { success: `Kullanıcı rolü ${newRole} olarak güncellendi` }

    } catch (error) {
    console.error('Change user role error:', error)
    return { error: 'Rol değiştirilirken bir hata oluştu' }
  }
}

// Adres yönetimi fonksiyonları
export async function getUserAddresses() {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return { success: false, error: 'Oturum bulunamadı' }
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return { success: true, addresses }
  } catch (error) {
    console.error('Adresler getirilirken hata:', error)
    return { success: false, error: 'Adresler getirilemedi' }
  }
}

export async function createAddress(addressData) {
  try {
    console.log('createAddress called with data:', addressData)
    
    const user = await getCurrentUser()
    console.log('User:', user)
    
    if (!user?.id) {
      console.log('No user ID found')
      return { success: false, error: 'Oturum bulunamadı' }
    }

    // Eğer bu varsayılan adres ise, diğerlerini güncelle
    if (addressData.isDefault) {
      console.log('Setting as default address, updating others...')
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      })
    }

    console.log('Creating address with data:', {
      ...addressData,
      userId: user.id
    })

    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId: user.id
      }
    })

    console.log('Address created successfully:', address)
    return { success: true, address }
  } catch (error) {
    console.error('Adres oluşturulurken hata:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return { success: false, error: 'Adres oluşturulamadı: ' + error.message }
  }
}

export async function updateAddress(addressId, addressData) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return { success: false, error: 'Oturum bulunamadı' }
    }

    // Adresin kullanıcıya ait olduğunu kontrol et
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id }
    })

    if (!existingAddress) {
      return { success: false, error: 'Adres bulunamadı' }
    }

    // Eğer bu varsayılan adres ise, diğerlerini güncelle
    if (addressData.isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, id: { not: addressId } },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: addressData
    })

    return { success: true, address }
  } catch (error) {
    console.error('Adres güncellenirken hata:', error)
    return { success: false, error: 'Adres güncellenemedi' }
  }
}

export async function deleteAddress(addressId) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return { success: false, error: 'Oturum bulunamadı' }
    }

    // Adresin kullanıcıya ait olduğunu kontrol et
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id }
    })

    if (!existingAddress) {
      return { success: false, error: 'Adres bulunamadı' }
    }

    await prisma.address.delete({
      where: { id: addressId }
    })

    return { success: true }
  } catch (error) {
    console.error('Adres silinirken hata:', error)
    return { success: false, error: 'Adres silinemedi' }
  }
}

// Ödeme yöntemi yönetimi fonksiyonları
export async function getUserPaymentMethods() {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return { success: false, error: 'Oturum bulunamadı' }
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return { success: true, paymentMethods }
  } catch (error) {
    console.error('Ödeme yöntemleri getirilirken hata:', error)
    return { success: false, error: 'Ödeme yöntemleri getirilemedi' }
  }
}

export async function createPaymentMethod(paymentData) {
  try {
    console.log('createPaymentMethod called with data:', paymentData)
    
    const user = await getCurrentUser()
    console.log('User:', user)
    
    if (!user?.id) {
      console.log('No user ID found')
      return { success: false, error: 'Oturum bulunamadı' }
    }

    // Kart numarasını son 4 hane olarak sakla
    if (paymentData.cardNumber) {
      console.log('Original card number length:', paymentData.cardNumber.length)
      paymentData.cardNumber = paymentData.cardNumber.slice(-4)
      console.log('Stored card number (last 4 digits):', paymentData.cardNumber)
    }

    // Eğer bu varsayılan ödeme yöntemi ise, diğerlerini güncelle
    if (paymentData.isDefault) {
      console.log('Setting as default payment method, updating others...')
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      })
    }

    console.log('Creating payment method with data:', {
      ...paymentData,
      userId: user.id
    })

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        ...paymentData,
        userId: user.id
      }
    })

    console.log('Payment method created successfully:', paymentMethod)
    return { success: true, paymentMethod }
  } catch (error) {
    console.error('Ödeme yöntemi oluşturulurken hata:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return { success: false, error: 'Ödeme yöntemi oluşturulamadı: ' + error.message }
  }
}

export async function updatePaymentMethod(paymentId, paymentData) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return { success: false, error: 'Oturum bulunamadı' }
    }

    // Ödeme yönteminin kullanıcıya ait olduğunu kontrol et
    const existingPayment = await prisma.paymentMethod.findFirst({
      where: { id: paymentId, userId: user.id }
    })

    if (!existingPayment) {
      return { success: false, error: 'Ödeme yöntemi bulunamadı' }
    }

    // Kart numarasını son 4 hane olarak sakla
    if (paymentData.cardNumber) {
      paymentData.cardNumber = paymentData.cardNumber.slice(-4)
    }

    // Eğer bu varsayılan ödeme yöntemi ise, diğerlerini güncelle
    if (paymentData.isDefault && !existingPayment.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, id: { not: paymentId } },
        data: { isDefault: false }
      })
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentId },
      data: paymentData
    })

    return { success: true, paymentMethod }
  } catch (error) {
    console.error('Ödeme yöntemi güncellenirken hata:', error)
    return { success: false, error: 'Ödeme yöntemi güncellenemedi' }
  }
}

export async function deletePaymentMethod(paymentId) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return { success: false, error: 'Oturum bulunamadı' }
    }

    // Ödeme yönteminin kullanıcıya ait olduğunu kontrol et
    const existingPayment = await prisma.paymentMethod.findFirst({
      where: { id: paymentId, userId: user.id }
    })

    if (!existingPayment) {
      return { success: false, error: 'Ödeme yöntemi bulunamadı' }
    }

    await prisma.paymentMethod.delete({
      where: { id: paymentId }
    })

    return { success: true }
  } catch (error) {
    console.error('Ödeme yöntemi silinirken hata:', error)
    return { success: false, error: 'Ödeme yöntemi silinemedi' }
  }
} 