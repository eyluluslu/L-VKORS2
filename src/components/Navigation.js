'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function Navigation() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [settings, setSettings] = useState({ logoUrl: null })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, cartRes, settingsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/cart/count'),
          fetch('/api/settings')
        ])

        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData)
        }

        if (cartRes.ok) {
          const cartData = await cartRes.json()
          setCartCount(cartData.count || 0)
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
        }
      } catch (error) {
        console.error('Navigation veri yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-32 h-8 bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-16 h-4 bg-slate-700 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="w-24 h-8 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Livkors Logo" 
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-yellow-300 transition-all transform group-hover:scale-110"
                />
              ) : (
                <img 
                  src="/logo.jpg" 
                  alt="Livkors Logo" 
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-yellow-300 transition-all transform group-hover:scale-110"
                />
              )}
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-yellow-400 transition-all">
                Livkors
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors font-medium">
              Ana Sayfa
            </Link>
            <Link href="/categories" className="text-slate-300 hover:text-white transition-colors font-medium">
              Kategoriler
            </Link>
            <Link href="/products" className="text-slate-300 hover:text-white transition-colors font-medium">
              Ürünler
            </Link>
            {user && (
              <Link href="/messages" className="text-slate-300 hover:text-white transition-colors font-medium">
                Mesajlar
              </Link>
            )}
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors font-medium">
              Hakkımızda
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/cart" 
                  className="relative text-slate-300 hover:text-white p-2 transition-colors"
                  title="Sepet"
                >
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <span className="text-slate-400 text-sm hidden sm:block">
                  Hoş geldin, {user.name}
                </span>
                {user.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 text-sm font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                <LogoutButton />
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 