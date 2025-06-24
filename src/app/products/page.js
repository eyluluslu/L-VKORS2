import Link from 'next/link'
import { getCurrentUser, getPublicProducts } from '@/lib/actions'
import { getSiteSettings } from '@/lib/site-actions'
import AddToCartButton from '@/components/AddToCartButton'
import LogoutButton from '@/components/LogoutButton'
import ImageWithFallback from '@/components/ImageWithFallback'
import CartIcon from '@/components/CartIcon'

export default async function ProductsPage() {
  const user = await getCurrentUser()
  const [products, siteSettingsResult] = await Promise.all([
    getPublicProducts(),
    getSiteSettings()
  ])
  
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation Bar */}
      <div className="relative z-30 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              {siteSettings?.logoUrl ? (
                <img 
                  src={siteSettings.logoUrl} 
                  alt={siteSettings?.siteName || 'Livkors'} 
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-400"
                />
              ) : (
                <img 
                  src="/logo.jpg" 
                  alt="Livkors Logo" 
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-400"
                />
              )}
              <span className="text-xl font-bold text-white">Livkors</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/products" className="text-purple-400 font-medium">
                Ürünler
              </Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                Hakkımızda
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Cart Icon */}
                  <CartIcon user={user} />
                  
                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <Link 
                      href="/profile" 
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      👤 {user.name}
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link 
                        href="/admin" 
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-500 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
              <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                {siteSettings?.logoUrl ? (
                  <img 
                    src={siteSettings.logoUrl} 
                    alt={siteSettings?.siteName || 'Livkors'} 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-400 shadow-lg"
                  />
                ) : (
                  <img 
                    src="/logo.jpg" 
                    alt="Livkors Logo" 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-400 shadow-lg"
                  />
                )}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Livkors Koleksiyonu
                </h1>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Özenle seçilmiş premium çanta koleksiyonumuzla stilinizi yansıtın. 
              Her biri kalite ve zarafeti bir araya getiren eşsiz tasarımlar.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-md mx-auto">
                <div className="text-8xl mb-6 animate-bounce">🛍️</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Yakında Gelecek Ürünler
                </h2>
                <p className="text-slate-300 mb-6">
                  Muhteşem koleksiyonumuz çok yakında burada olacak.
                </p>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Filter Bar */}
              <div className="mb-12">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-300 font-medium">Filtrele:</span>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors">
                        Tümü
                      </button>
                      <button className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-colors">
                        Yeni Gelenler
                      </button>
                      <button className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-colors">
                        Popüler
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300">
                      <span className="text-sm">{products.length} ürün bulundu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Product Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 animate-fadeInUp">
                      {/* Image Container */}
                      <div className="relative h-72 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                        <ImageWithFallback
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Quick Action Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <button className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                              👁️ Hızlı Görünüm
                            </button>
                          </div>
                        </div>

                        {/* Stock Badge */}
                        <div className="absolute top-4 left-4 z-30">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                            product.stock > 0 
                              ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                              : 'bg-red-500/20 text-red-300 border-red-400/30'
                          }`}>
                            {product.stock > 0 ? `${product.stock} adet` : 'Tükendi'}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 right-4 z-30">
                          <span className="px-3 py-1 bg-purple-600/20 backdrop-blur-md text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium">
                            {product.category?.name}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        {/* Product Name */}
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              ₺{product.price}
                            </span>
                            <span className="text-xs text-slate-400">KDV dahil</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {user ? (
                              <AddToCartButton 
                                productId={product.id} 
                                disabled={product.stock === 0}
                              />
                            ) : (
                              <Link
                                href="/login"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 text-sm font-medium shadow-lg"
                              >
                                Giriş Yap
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                  </div>
                ))}
              </div>

              {/* Load More Section */}
              <div className="text-center mt-16">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
                  <p className="text-slate-300 mb-4">Daha fazla ürün görmek ister misiniz?</p>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 font-medium shadow-lg">
                    Daha Fazla Yükle
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 