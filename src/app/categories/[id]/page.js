import Link from 'next/link'
import { getProductsByCategory, getCurrentUser } from '@/lib/actions'
import { getSiteSettings } from '@/lib/site-actions'
import ImageWithFallback from '@/components/ImageWithFallback'
import AddToCartButton from '@/components/AddToCartButton'
import CartIcon from '@/components/CartIcon'

export default async function CategoryPage({ params }) {
  const [products, user, siteSettingsResult] = await Promise.all([
    getProductsByCategory(params.id),
    getCurrentUser(),
    getSiteSettings()
  ])
  
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2s"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4s"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl max-w-lg mx-auto text-center">
            <div className="text-8xl mb-6 animate-pulse">📦</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Bu kategoride ürün bulunamadı
            </h1>
            <p className="text-white/70 mb-8">
              Henüz bu kategoriye ürün eklenmemiş. Diğer kategorileri keşfedin.
            </p>
            <Link
              href="/categories"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
            >
              ← Kategorilere Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const categoryName = products[0]?.category?.name || 'Kategori'

  function getCategoryIcon(categoryName) {
    const name = categoryName.toLowerCase()
    if (name.includes('women') || name.includes('kadın')) return '👜'
    if (name.includes('men') || name.includes('erkek')) return '🎒'
    if (name.includes('travel') || name.includes('seyahat')) return '🧳'
    if (name.includes('business') || name.includes('iş')) return '💼'
    if (name.includes('sport') || name.includes('spor')) return '🏃‍♂️'
    if (name.includes('school') || name.includes('okul')) return '🎓'
    if (name.includes('elektronik')) return '📱'
    if (name.includes('giyim')) return '👔'
    return '🏷️'
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4s"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/10 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {siteSettings?.logoUrl ? (
                  <img 
                    src={siteSettings.logoUrl} 
                    alt={siteSettings?.siteName || 'Livkors'} 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30 shadow-lg hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <img 
                    src="/logo.jpg" 
                    alt="Livkors" 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30 shadow-lg hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div>
                  {/* Breadcrumb */}
                  <nav className="flex items-center space-x-2 text-white/70 text-sm mb-2">
                    <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
                    <span>→</span>
                    <Link href="/categories" className="hover:text-white transition-colors">Kategoriler</Link>
                    <span>→</span>
                    <span className="text-white font-medium">{categoryName}</span>
                  </nav>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getCategoryIcon(categoryName)}</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      {categoryName}
                    </h1>
                  </div>
                  <div className="h-1 w-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2"></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <CartIcon user={user} />
                
                <Link 
                  href="/categories"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  ← Kategoriler
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-white/80">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">
                  🎯 {products.length} Premium Ürün Bulundu
                </span>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-white/10 rounded-full">En Popüler</span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                  ✨ Özel Koleksiyon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  {/* Floating Ping Effect */}
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
                  </div>

                  {/* Product Image */}
                  <div className="h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 overflow-hidden relative">
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Stock Badge */}
                    <div className="absolute top-4 left-4">
                      {product.stock > 0 ? (
                        <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white text-xs rounded-full border border-green-400/50">
                          ✅ Stokta
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/80 backdrop-blur-sm text-white text-xs rounded-full border border-red-400/50">
                          ❌ Tükendi
                        </span>
                      )}
                    </div>

                    {/* Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                      <span className="text-white font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                        Hızlı Görünüm
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {product.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ₺{product.price}
                      </div>
                      <div className="text-white/60 text-sm">
                        Stok: {product.stock}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {user ? (
                      <AddToCartButton 
                        productId={product.id} 
                        disabled={product.stock === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl py-3 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    ) : (
                      <Link
                        href="/login"
                        className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl py-3 text-center font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        Giriş Yap
                      </Link>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4 w-full bg-white/10 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full transition-all duration-1000 group-hover:w-full" 
                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Footer */}
        <div className="backdrop-blur-md bg-white/5 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <Link href="/" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
                  🏠 Ana Sayfa
                </Link>
                <Link href="/categories" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
                  🏷️ Kategoriler
                </Link>
                <Link href="/products" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
                  🛍️ Tüm Ürünler
                </Link>
              </div>
              <div className="text-white/60 text-sm flex items-center space-x-2">
                <span>© 2024 Livkors</span>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>Premium E-ticaret</span>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>{categoryName} Kategorisi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 