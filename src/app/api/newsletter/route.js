import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-posta adresi gerekli' 
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz e-posta adresi' 
      }, { status: 400 })
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu e-posta adresi zaten abone listesinde' 
      }, { status: 400 })
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Başarıyla abone oldunuz! %20 indirim kuponunuz e-posta adresinize gönderildi.' 
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Abone olurken hata oluştu' 
    }, { status: 500 })
  }
} 