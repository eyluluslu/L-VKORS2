'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CartIcon({ user }) {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (user) {
      // İlk sayıyı yükle
      fetchCartCount()

      // Cart güncelleme event'lerini dinle
      const handleCartUpdate = () => {
        fetchCartCount()
      }

      window.addEventListener('cartUpdated', handleCartUpdate)

      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate)
      }
    }
  }, [user])

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart/count', {
        method: 'GET',
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.count || 0)
      } else {
        setCartCount(0)
      }
    } catch (error) {
      console.error('Cart count fetch error:', error)
      setCartCount(0)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Link href="/cart" className="relative p-3 text-xl text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-700/50">
      🛒
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {cartCount}
        </span>
      )}
    </Link>
  )
} 