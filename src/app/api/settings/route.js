import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/site-actions'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Site ayarları hatası:', error)
    return NextResponse.json({ logoUrl: null })
  }
} 