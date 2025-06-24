import Link from 'next/link'
import { getPublicCategories } from '@/lib/actions'
import { getSiteSettings } from '@/lib/site-actions'

export default async function CategoriesPage() {
  let categories = []
  let siteSettings = null
  
  try {
    const [categoriesResult, settingsResult] = await Promise.all([
      getPublicCategories(),
      getSiteSettings()
    ])
    
    categories = categoriesResult || []
    siteSettings = settingsResult.success ? settingsResult.data : null
    
    console.log('📄 Categories page - received categories:', categories.length)
    if (categories.length > 0) {
      console.log('📄 First category:', categories[0].name)
    } else {
      console.log('⚠️ No categories received')
    }
  } catch (error) {
    console.error('📄 Categories page error:', error)
    categories = []
  }
  
  const hasCategories = Array.isArray(categories) && categories.length > 0

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

  function getCategoryGradient(index) {
    const gradients = [
      'from-purple-500 via-pink-500 to-red-500',
      'from-blue-500 via-teal-500 to-green-500', 
      'from-orange-500 via-red-500 to-pink-500',
      'from-indigo-500 via-purple-500 to-pink-500',
      'from-green-500 via-teal-500 to-blue-500',
      'from-yellow-500 via-orange-500 to-red-500'
    ]
    return gradients[index % gradients.length]
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

      {/* Header */}
      <div className="relative z-10">
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
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Kategoriler
                  </h1>
                  <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2"></div>
                </div>
              </div>
              <Link 
                href="/"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                ← Ana Sayfa
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-white/80">
              <span className="text-lg font-medium">
                🏷️ {hasCategories ? categories.length : 0} Kategori Keşfedin
              </span>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-white/10 rounded-full">Premium Koleksiyon</span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                  ✨ Yeni Ürünler
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!hasCategories ? (
            <div className="text-center py-20">
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl max-w-md mx-auto">
                <div className="text-8xl mb-6 animate-pulse">📦</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Kategoriler Yükleniyor...
                </h3>
                <p className="text-white/70 mb-6">
                  Kategori verileri hazırlanıyor. Lütfen bekleyin.
                </p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
                <div className="text-sm text-white/50 space-y-1">
                  <p>Kategoriler: {categories?.length || 0}</p>
                  <p>Durum: {Array.isArray(categories) ? 'Hazır' : 'Bekleniyor'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="group animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                    {/* Floating Ping Effect */}
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
                    </div>

                    {/* Category Image/Icon */}
                    <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(index)} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative z-10 text-7xl text-white group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
                        {getCategoryIcon(category.name)}
                      </div>
                      {/* Overlay Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                        <span className="text-white font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                          Kategoriye Git →
                        </span>
                      </div>
                    </div>
                    
                    {/* Category Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                        {category.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {category.description || 'Bu kategorideki premium ürünleri keşfedin ve hayalinizdeki ürünü bulun.'}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          <span className="text-white/80 text-sm font-medium">
                            {category._count?.products || 0} Ürün
                          </span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-purple-300 font-medium text-sm">
                            Keşfet →
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 w-full bg-white/10 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full transition-all duration-1000 group-hover:w-full" 
                          style={{ width: `${Math.min((category._count?.products || 0) * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Premium Footer */}
        <div className="backdrop-blur-md bg-white/5 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <Link href="/" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
                  🏠 Ana Sayfa
                </Link>
                <Link href="/products" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
                  🛍️ Tüm Ürünler
                </Link>
                <Link href="/login" className="text-white/80 hover:text-white transition-colors duration-300 font-medium">
                  👤 Giriş Yap
                </Link>
              </div>
              <div className="text-white/60 text-sm flex items-center space-x-2">
                <span>© 2024 Livkors</span>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>Premium E-ticaret</span>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span>Tüm hakları saklıdır</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 