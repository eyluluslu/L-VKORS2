import { getCartItems } from '@/lib/actions'
import CartList from '@/components/CartList'
import Link from 'next/link'

export default async function CartPage() {
  const cartItems = await getCartItems()

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                🛒 Sepetim
              </h1>
              <p className="text-slate-400 mt-1">
                {cartItems.length > 0 ? `${cartItems.length} ürün sepetinizde` : 'Sepetiniz boş'}
              </p>
            </div>
            <Link 
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>🛍️</span>
              <span>Alışverişe Devam Et</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800 rounded-3xl p-12 max-w-md mx-auto border border-slate-700">
              <div className="text-8xl mb-6 animate-bounce">🛒</div>
              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                Sepetiniz Boş
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Kaliteli ürünlerimizi keşfedin ve alışverişe başlayın.
              </p>
              <div className="space-y-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="mr-2">🎯</span>
                  Ürünleri Keşfet
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center w-full px-8 py-4 border-2 border-slate-600 text-slate-300 rounded-xl font-medium hover:bg-slate-700 hover:border-slate-500 transition-all duration-300"
                >
                  <span className="mr-2">📂</span>
                  Kategorilere Gözat
                </Link>
              </div>
            </div>

            {/* Öne Çıkan Kategoriler */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-slate-100 mb-8">Popüler Kategoriler</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4">👜</div>
                  <h4 className="text-xl font-bold text-white mb-2">Kadın Çantaları</h4>
                  <p className="text-purple-100">Şık ve modern tasarımlar</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4">💼</div>
                  <h4 className="text-xl font-bold text-white mb-2">İş Çantaları</h4>
                  <p className="text-blue-100">Profesyonel görünüm</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4">🎒</div>
                  <h4 className="text-xl font-bold text-white mb-2">Sırt Çantaları</h4>
                  <p className="text-emerald-100">Günlük kullanım için ideal</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CartList items={cartItems} />
        )}
      </div>
    </div>
  )
} 