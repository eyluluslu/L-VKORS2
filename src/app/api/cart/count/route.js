import { NextResponse } from 'next/server'
import { getCurrentUser, getCartCount } from '@/lib/actions'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ count: 0 })
    }

    const count = await getCartCount()
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Sepet sayısı hatası:', error)
    return NextResponse.json({ count: 0 })
  }
} 