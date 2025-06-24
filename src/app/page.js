import Link from 'next/link'
import { getCurrentUser, getPublicProducts } from '@/lib/actions'
import { getHeroBanners, getSiteSettings } from '@/lib/site-actions'
import { getAboutPageData } from '@/lib/about-actions'
import HeroSlider from '@/components/HeroSlider'
import Newsletter from '@/components/Newsletter'
import AddToCartButton from '@/components/AddToCartButton'
import ImageWithFallback from '@/components/ImageWithFallback'
import CartIcon from '@/components/CartIcon'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  // Banner, site ayarları, iletişim bilgileri ve ürünleri getir
  const [banners, siteSettings, aboutData, productsResult] = await Promise.all([
    getHeroBanners().then(result => result.success ? result.data : []),
    getSiteSettings().then(result => result.success ? result.data : null),
    getAboutPageData().then(result => result.success ? result.data : null),
    getPublicProducts()
  ])

  // İlk 3 ürünü öne çıkan ürünler olarak göster
  const featuredProducts = productsResult?.slice(0, 3) || []

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/95 backdrop-blur-lg shadow-2xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                {siteSettings?.logoUrl ? (
                  <img 
                    src={siteSettings.logoUrl} 
                    alt={siteSettings?.siteName || 'Livkors'} 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-400 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <img 
                    src="/logo.jpg" 
                    alt="Livkors" 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-400 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {siteSettings?.siteName || 'Livkors'}
                </span>
              </Link>
            </div>
            
            {/* Center Menu */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-6">
                <Link href="/" className="relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-700/50 group">
                  <span className="relative z-10">Ana Sayfa</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/products" className="relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-700/50 group">
                  <span className="relative z-10">Ürünler</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/categories" className="relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-700/50 group">
                  <span className="relative z-10">Kategoriler</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {user && (
                  <>
                    <Link href="/messages" className="relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-700/50 group">
                      <span className="relative z-10">Mesajlar</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="/profile" className="relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-700/50 group">
                      <span className="relative z-10">Profil</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </>
                )}
                <Link href="/about" className="relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-slate-700/50 group">
                  <span className="relative z-10">Hakkımızda</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {user ? (
                <>
                  {/* User Welcome */}
                  <div className="hidden xl:flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-white font-medium">{user.name}</div>
                      {user.role === 'ADMIN' && (
                        <div className="text-xs text-amber-400 font-semibold">👑 Admin</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <CartIcon user={user} />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Giriş Yap
                  </Link>
                  <Link href="/register" className="border-2 border-purple-500 text-purple-400 px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 hover:text-white transition-all duration-300">
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>



      {/* Hero Banner Slider */}
      <HeroSlider banners={banners} />

      {/* Welcome Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              {siteSettings?.heroTitle || 'Özel Tasarım Çantalar'}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              {siteSettings?.heroSubtitle || 'Her tarza uygun kaliteli çantalar. Kadın, erkek ve özel koleksiyonlarımızla stilinizi tamamlayın.'}
            </p>
            {user?.role === 'ADMIN' && (
              <div className="inline-flex items-center px-4 py-2 bg-slate-700 text-slate-200 rounded-lg border border-slate-600">
                <span className="text-sm">💡 Admin olarak banner'ları <Link href="/admin" className="font-medium underline text-blue-400 hover:text-blue-300">yönetim panelinden</Link> düzenleyebilirsiniz</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-slate-300">Mutlu Müşteri</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-slate-300">Ürün Çeşidi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">5⭐</div>
              <div className="text-slate-300">Müşteri Puanı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-slate-300">Yıl Tecrübe</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              🔥 Öne Çıkan Ürünler
            </h2>
            <p className="text-xl text-slate-300">
              En çok tercih edilen ve trend ürünlerimiz
            </p>
          </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product.id} className="bg-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-600">
                    <div className="h-64 relative overflow-hidden">
                      <ImageWithFallback
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        fallbackText="👜"
                        errorText="👜"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">{product.name}</h3>
                      <p className="text-slate-300 mb-4">{product.description || 'Kaliteli ve şık tasarım'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-400">₺{product.price}</span>
                        <div className="flex space-x-2">
                          <AddToCartButton productId={product.id} />
                          <Link href="/products" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors">
                            İncele
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback: Eğer ürün yoksa varsayılan ürünleri göster
                <>
                  <div className="bg-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-600">
                    <div className="h-64 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-8xl">👜</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">Lüks Deri El Çantası</h3>
                      <p className="text-slate-300 mb-4">Premium kalite gerçek deri, elegant tasarım</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-400">₺599</span>
                        <Link href="/products" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors">
                          İncele
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-600">
                    <div className="h-64 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <span className="text-8xl">💼</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">Business Laptop Çantası</h3>
                      <p className="text-slate-300 mb-4">15.6" laptop uyumlu, su geçirmez</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-400">₺299</span>
                        <Link href="/products" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                          İncele
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-600">
                    <div className="h-64 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                      <span className="text-8xl">🎒</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-100 mb-2">Outdoor Sırt Çantası</h3>
                      <p className="text-slate-300 mb-4">40L kapasiteli, dağcılık için ideal</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-400">₺199</span>
                        <Link href="/products" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors">
                          İncele
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          <div className="text-center mt-12">
            <Link href="/products" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl">
              Tüm Ürünleri Görüntüle
              <span className="ml-2">🚀</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Çanta Koleksiyonlarımız
            </h2>
            <p className="text-xl text-slate-300">
              Her ihtiyaca ve stile uygun kaliteli çanta seçenekleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Kadın Çantaları */}
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-8 rounded-2xl shadow-xl border border-purple-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-6 filter drop-shadow-lg">👜</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">Kadın Çantaları</h3>
              <ul className="text-slate-300 space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-pink-400 mr-3">✨</span> El çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-3">✨</span> Omuz çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-3">✨</span> Clutch çantalar
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-3">✨</span> Çapraz askılı çantalar
                </li>
              </ul>
              <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-xl font-semibold hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Koleksiyonu İncele 
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Erkek Çantaları */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-2xl shadow-xl border border-blue-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-6 filter drop-shadow-lg">💼</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">Erkek Çantaları</h3>
              <ul className="text-slate-300 space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">🔥</span> Evrak çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">🔥</span> Laptop çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">🔥</span> Sırt çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-3">🔥</span> Spor çantaları
                </li>
              </ul>
              <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Koleksiyonu İncele 
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Seyahat Çantaları */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 p-8 rounded-2xl shadow-xl border border-emerald-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-6 filter drop-shadow-lg">🧳</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">Seyahat Çantaları</h3>
              <ul className="text-slate-300 space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">🌟</span> Bavullar
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">🌟</span> Seyahat çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">🌟</span> Kabin çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-400 mr-3">🌟</span> Spor çantaları
                </li>
              </ul>
              <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Koleksiyonu İncele 
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Okul Çantaları */}
            <div className="bg-gradient-to-br from-amber-900 to-yellow-900 p-8 rounded-2xl shadow-xl border border-amber-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-6 filter drop-shadow-lg">🎒</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">Okul Çantaları</h3>
              <ul className="text-slate-300 space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-amber-400 mr-3">📚</span> Öğrenci çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-amber-400 mr-3">📚</span> Sırt çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-amber-400 mr-3">📚</span> Kalem kutuları
                </li>
                <li className="flex items-center">
                  <span className="text-amber-400 mr-3">📚</span> Laptop bölmeli çantalar
                </li>
              </ul>
              <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-700 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Koleksiyonu İncele 
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Vintage Koleksiyonu */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl shadow-xl border border-purple-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-6 filter drop-shadow-lg">🎩</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">Vintage Koleksiyonu</h3>
              <ul className="text-slate-300 space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">🌸</span> Vintage el çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">🌸</span> Retro sırt çantaları
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">🌸</span> Antika desenli çantalar
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">🌸</span> Özel dikiş çantalar
                </li>
              </ul>
              <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Koleksiyonu İncele 
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Lüks Koleksiyonu */}
            <div className="bg-gradient-to-br from-yellow-900 to-amber-900 p-8 rounded-2xl shadow-xl border border-yellow-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-6 filter drop-shadow-lg">👑</div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">Lüks Koleksiyonu</h3>
              <ul className="text-slate-300 space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✨</span> Deri çantalar
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">🎨</span> Tasarımcı koleksiyonu
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">⭐</span> Premium materyaller
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">🏆</span> Sınırlı üretim
                </li>
              </ul>
              <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-700 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Koleksiyonu İncele 
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              💬 Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-purple-200">
              Binlerce memnun müşterimizin gerçek yorumları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">A</div>
                <div className="ml-4">
                  <h4 className="font-semibold text-white">Ayşe K.</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-200 italic">"Aldığım çanta hem çok şık hem de çok kaliteli. Fiyat performans açısından harika! Kesinlikle tavsiye ederim."</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">M</div>
                <div className="ml-4">
                  <h4 className="font-semibold text-white">Mehmet Y.</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-200 italic">"Laptop çantası gerçekten çok fonksiyonel. Hem iş hem de günlük kullanım için mükemmel. Kargo da çok hızlıydı."</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">Z</div>
                <div className="ml-4">
                  <h4 className="font-semibold text-white">Zeynep A.</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-slate-200 italic">"Vintage koleksiyonundan aldığım çanta harika! Çok özgün ve kaliteli. Herkesten beğeni alıyorum."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              📈 Bu Hafta Trendler
            </h2>
            <p className="text-xl text-slate-300">
              En çok aranan ve satın alınan ürünler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-pink-900 to-rose-900 p-6 rounded-2xl border border-pink-800 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-3">👛</div>
              <h3 className="font-bold text-white mb-2">Mini Çantalar</h3>
              <p className="text-pink-200 text-sm mb-3">Kompakt ve şık tasarımlar</p>
              <div className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">🔥 HOT</div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-cyan-900 p-6 rounded-2xl border border-blue-800 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="font-bold text-white mb-2">Tech Çantalar</h3>
              <p className="text-blue-200 text-sm mb-3">Laptop ve tablet bölmeli</p>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">📱 TECH</div>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-emerald-900 p-6 rounded-2xl border border-green-800 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="font-bold text-white mb-2">Eco Friendly</h3>
              <p className="text-green-200 text-sm mb-3">Geri dönüştürülmüş malzeme</p>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">🌱 ECO</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-2xl border border-purple-800 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-white mb-2">Premium Koleksiyon</h3>
              <p className="text-purple-200 text-sm mb-3">Lüks ve sınırlı üretim</p>
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">👑 LUX</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              ⚡ Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="text-xl text-slate-300">
              Kalite, güven ve müşteri memnuniyeti önceliğimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border border-slate-600 hover:from-slate-700 hover:to-slate-600 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl mb-6 filter drop-shadow-lg">🚚</div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Hızlı Kargo</h3>
              <p className="text-slate-300">Tüm Türkiye'ye ücretsiz ve hızlı kargo imkanı</p>
              <div className="mt-4 text-sm text-green-400 font-semibold">1-2 İş Günü</div>
            </div>

            <div className="text-center bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border border-slate-600 hover:from-slate-700 hover:to-slate-600 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl mb-6 filter drop-shadow-lg">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Güvenli Ödeme</h3>
              <p className="text-slate-300">SSL sertifikası ile korumalı güvenli ödeme sistemi</p>
              <div className="mt-4 text-sm text-blue-400 font-semibold">256-bit SSL</div>
            </div>

            <div className="text-center bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border border-slate-600 hover:from-slate-700 hover:to-slate-600 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl mb-6 filter drop-shadow-lg">↩️</div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Kolay İade</h3>
              <p className="text-slate-300">14 gün içinde koşulsuz iade garantisi</p>
              <div className="mt-4 text-sm text-yellow-400 font-semibold">Ücretsiz İade</div>
            </div>

            <div className="text-center bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border border-slate-600 hover:from-slate-700 hover:to-slate-600 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-5xl mb-6 filter drop-shadow-lg">📞</div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">7/24 Destek</h3>
              <p className="text-slate-300">Uzman ekibimiz her zaman hizmetinizde</p>
              <div className="mt-4 text-sm text-purple-400 font-semibold">Canlı Destek</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hayalinizdeki Çantayı Bulun
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Binlerce ürün arasından size en uygun çantayı seçin ve stilinizi yansıtın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-white text-blue-900 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Alışverişe Başla
            </Link>
            <Link 
              href="/categories" 
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Kategorileri İncele
            </Link>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                {siteSettings?.logoUrl ? (
                  <img 
                    src={siteSettings.logoUrl} 
                    alt={siteSettings?.siteName || 'Livkors'} 
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <img 
                    src="/logo.jpg" 
                    alt="Livkors" 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <h3 className="text-2xl font-bold text-white">
                  {siteSettings?.siteName || 'Livkors'}
                </h3>
              </div>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                Kaliteli çantalar ve aksesuar konusunda Türkiye'nin öncü markası. 
                2004'ten beri her tarza uygun ürünlerimizle stilinizi tamamlıyoruz.
              </p>
              <div className="flex space-x-4">
                {siteSettings?.socialFacebook && (
                  <a 
                    href={siteSettings.socialFacebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-900 hover:text-white transition-all duration-300"
                    title="Facebook'ta bizi takip edin"
                  >
                    📘
                  </a>
                )}
                {siteSettings?.socialInstagram && (
                  <a 
                    href={siteSettings.socialInstagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-pink-400 hover:bg-pink-900 hover:text-white transition-all duration-300"
                    title="Instagram'da bizi takip edin"
                  >
                    📷
                  </a>
                )}
                {siteSettings?.socialTwitter && (
                  <a 
                    href={siteSettings.socialTwitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-900 hover:text-white transition-all duration-300"
                    title="Twitter'da bizi takip edin"
                  >
                    🐦
                  </a>
                )}
                {siteSettings?.socialLinkedin && (
                  <a 
                    href={siteSettings.socialLinkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-900 hover:text-white transition-all duration-300"
                    title="LinkedIn'de bizi takip edin"
                  >
                    💼
                  </a>
                )}
                {/* Eğer hiç sosyal medya linki yoksa, varsayılan mesaj göster */}
                {!siteSettings?.socialFacebook && !siteSettings?.socialInstagram && !siteSettings?.socialTwitter && !siteSettings?.socialLinkedin && (
                  <div className="text-slate-500 text-sm">
                    <p>Sosyal medya linklerini <Link href="/admin" className="text-blue-400 hover:text-blue-300 underline">admin panelinden</Link> ekleyebilirsiniz</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 text-white">🔗 Hızlı Linkler</h3>
              <ul className="space-y-3">
                <li><Link href="/products" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">🛍️</span>Ürünler</Link></li>
                <li><Link href="/categories" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">📂</span>Kategoriler</Link></li>
                <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">ℹ️</span>Hakkımızda</Link></li>
                {user && <li><Link href="/profile" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">👤</span>Profil</Link></li>}
                {!user && <li><Link href="/login" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">🔐</span>Giriş Yap</Link></li>}
                <li><Link href="/cart" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">🛒</span>Sepet</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 text-white">📞 İletişim</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-slate-400">
                  <span className="text-blue-400 mr-3 text-xl">📧</span>
                  <div>
                    <div className="font-semibold">E-posta</div>
                    <div>{aboutData?.email || 'info@livkors.com'}</div>
                  </div>
                </li>
                <li className="flex items-center text-slate-400">
                  <span className="text-green-400 mr-3 text-xl">📞</span>
                  <div>
                    <div className="font-semibold">Telefon</div>
                    <div>{aboutData?.phone || '+90 212 123 45 67'}</div>
                  </div>
                </li>
                <li className="flex items-center text-slate-400">
                  <span className="text-red-400 mr-3 text-xl">📍</span>
                  <div>
                    <div className="font-semibold">Adres</div>
                    <div>{aboutData?.address || 'Beyoğlu, İstanbul'}</div>
                  </div>
                </li>
                <li className="flex items-center text-slate-400">
                  <span className="text-purple-400 mr-3 text-xl">🕒</span>
                  <div>
                    <div className="font-semibold">Çalışma Saatleri</div>
                    <div>{aboutData?.workingHours || '09:00 - 18:00'}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-500 mb-4 md:mb-0">
                &copy; 2024 {siteSettings?.siteName || 'Livkors'}. Tüm hakları saklıdır. 
                <span className="ml-2">🇹🇷 Türkiye'de tasarlandı</span>
              </p>
              <div className="flex items-center space-x-6 text-slate-500">
                <a href="#" className="hover:text-slate-300 transition-colors">Gizlilik Politikası</a>
                <a href="#" className="hover:text-slate-300 transition-colors">Kullanım Şartları</a>
                <a href="#" className="hover:text-slate-300 transition-colors">KVKK</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
