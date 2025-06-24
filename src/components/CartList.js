'use client'

import React, { useState, useEffect } from 'react'
import { updateCartItemQuantity, removeFromCart, clearCart } from '@/lib/actions'
import { useActionState } from 'react'
import ImageWithFallback from './ImageWithFallback'
import Link from 'next/link'

export default function CartList({ items: initialItems }) {
  const [cartItems, setCartItems] = useState(initialItems || [])
  const [loading, setLoading] = useState(false)
  const [clearState, clearAction] = useActionState(clearCart, {})

  useEffect(() => {
    setCartItems(initialItems || [])
  }, [initialItems])

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return

    setLoading(true)
    const formData = new FormData()
    formData.append('cartItemId', cartItemId)
    formData.append('quantity', newQuantity.toString())

    try {
      const result = await updateCartItemQuantity({}, formData)
      if (result.success) {
        // Optimistic update
        setCartItems(prev => 
          prev.map(item => 
            item.id === cartItemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        )
        // Cart güncelleme event'ini tetikle
        window.dispatchEvent(new CustomEvent('cartUpdated'))
      }
    } catch (error) {
      console.error('Miktar güncellenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (cartItemId) => {
    if (!confirm('Bu ürünü sepetten çıkarmak istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      await removeFromCart(cartItemId)
      setCartItems(prev => prev.filter(item => item.id !== cartItemId))
      // Cart güncelleme event'ini tetikle
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (error) {
      console.error('Ürün kaldırılırken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!cartItems || cartItems.length === 0) {
    return null
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const tax = subtotal * 0.18 // KDV %18
  const deliveryFee = subtotal > 500 ? 0 : 29.99
  const total = subtotal + tax + deliveryFee

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sepet Ürünleri */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">🛍️</span>
              Sepetinizdeki Ürünler
              <span className="ml-3 bg-white/20 px-3 py-1 rounded-full text-sm">
                {cartItems.length} ürün
              </span>
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-700 rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Ürün Resmi */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-slate-600">
                      <ImageWithFallback
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        fallbackText="👜"
                      />
                    </div>
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {item.product.description || 'Kaliteli ürün açıklaması'}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        Kategori: {item.product.category?.name}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Fiyat */}
                      <div className="text-2xl font-bold text-green-400">
                        ₺{(item.product.price * item.quantity).toFixed(2)}
                        <span className="text-sm text-slate-400 ml-2">
                          (₺{item.product.price} x {item.quantity})
                        </span>
                      </div>

                      {/* Miktar ve İşlemler */}
                      <div className="flex items-center gap-4">
                        {/* Miktar Kontrolü */}
                        <div className="flex items-center bg-slate-600 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="px-3 py-2 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <span className="px-4 py-2 text-slate-100 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="px-3 py-2 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Sil Butonu */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <span>🗑️</span>
                          <span className="hidden sm:inline">Kaldır</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Sepeti Temizle */}
            <div className="pt-6 border-t border-slate-600">
              <form action={clearAction}>
                <button
                  type="submit"
                  className="bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>🧹</span>
                  Sepeti Temizle
                </button>
              </form>
              {clearState.error && (
                <p className="text-red-400 text-sm mt-2">{clearState.error}</p>
              )}
              {clearState.success && (
                <p className="text-green-400 text-sm mt-2">{clearState.success}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sipariş Özeti */}
      <div className="lg:col-span-1">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden sticky top-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">💰</span>
              Sipariş Özeti
            </h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>Ara Toplam:</span>
                <span>₺{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>KDV (%18):</span>
                <span>₺{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Kargo:</span>
                <span className={deliveryFee === 0 ? 'text-green-400 font-medium' : ''}>
                  {deliveryFee === 0 ? 'Ücretsiz!' : `₺${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-slate-400">
                  ₺{(500 - subtotal).toFixed(2)} daha harcayın, kargo ücretsiz olsun!
                </p>
              )}
            </div>

            <div className="border-t border-slate-600 pt-4">
              <div className="flex justify-between text-xl font-bold text-slate-100">
                <span>Toplam:</span>
                <span className="text-green-400">₺{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <span>🚀</span>
                Siparişi Tamamla
              </button>
              
              <Link 
                href="/products"
                className="w-full block text-center bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Alışverişe Devam Et
              </Link>
            </div>

            {/* Güvenlik Rozeti */}
            <div className="pt-4 border-t border-slate-600">
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-slate-300 text-sm">
                  256-bit SSL ile güvenli ödeme
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 