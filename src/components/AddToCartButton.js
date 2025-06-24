'use client'

import { useActionState, useEffect } from 'react'
import { addToCart } from '@/lib/actions'

export default function AddToCartButton({ productId, quantity = 1, disabled = false, className = '' }) {
  const [state, action] = useActionState(addToCart, {})

  // Sepete ekleme başarılı olduğunda event tetikle
  useEffect(() => {
    if (state.success) {
      // Cart güncelleme event'ini tetikle
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    }
  }, [state.success])

  return (
    <div>
      <form action={action}>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="quantity" value={quantity} />
        <button
          type="submit"
          disabled={disabled}
          className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
          </svg>
          Sepete Ekle
        </button>
      </form>

      {/* Durum Mesajları */}
      {state.error && (
        <div className="mt-2 text-sm text-red-600">
          {state.error}
        </div>
      )}
      
      {state.success && (
        <div className="mt-2 text-sm text-green-600">
          {state.success}
        </div>
      )}
    </div>
  )
} 