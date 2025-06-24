import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function POST(request) {
  try {
    // Admin kontrolü
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token bulunamadı' }, { status: 401 })
    }

    const payload = verifyToken(token)
    
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Bu işlem için admin yetkisi gereklidir' }, { status: 403 })
    }

    const data = await request.formData()
    const file = data.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    // Dosya türü kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Sadece JPG, PNG ve WebP formatları desteklenir' 
      }, { status: 400 })
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Dosya boyutu 5MB\'dan büyük olamaz' 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
    const extension = originalName.split('.').pop()
    const fileName = `banner_${timestamp}.${extension}`

    // Dosyayı kaydet
    const uploadPath = join(process.cwd(), 'public/uploads', fileName)
    await writeFile(uploadPath, buffer)

    // URL'i döndür
    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Dosya başarıyla yüklendi' 
    })

  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    return NextResponse.json({ 
      error: 'Dosya yüklenirken bir hata oluştu' 
    }, { status: 500 })
  }
} 