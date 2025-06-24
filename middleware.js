import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const payload = verifyToken(token)
      
      // Check if user is admin
      if (!payload || payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protected routes that require authentication
  if (pathname.startsWith('/cart') || 
      pathname.startsWith('/messages') || 
      pathname.startsWith('/profile')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const payload = verifyToken(token)
      if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/cart/:path*', '/messages/:path*', '/profile/:path*']
} 