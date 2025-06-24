import Link from 'next/link'
import { getCurrentUser, getCartCount } from '@/lib/actions'
import { getAboutPageData } from '@/lib/about-actions'
import { getTeamMembers } from '@/lib/team-actions'
import { getSiteSettings } from '@/lib/site-actions'

export default async function AboutPage() {
  const [user, cartCount, aboutResult, siteSettingsResult, teamMembersResult] = await Promise.all([
    getCurrentUser(),
    getCurrentUser().then(u => u ? getCartCount() : 0),
    getAboutPageData(),
    getSiteSettings(),
    getTeamMembers()
  ])

  const aboutData = aboutResult.success ? aboutResult.data : null
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null
  const teamMembers = teamMembersResult.success ? teamMembersResult.data : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
                          <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  {siteSettings?.logoUrl ? (
                    <img 
                      src={siteSettings.logoUrl} 
                      alt={siteSettings?.siteName || 'Livkors'} 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-yellow-300 transition-all transform group-hover:scale-110"
                    />
                  ) : (
                    <img 
                      src="/logo.jpg" 
                      alt="Livkors" 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-yellow-300 transition-all transform group-hover:scale-110"
                    />
                  )}
                  <span className="text-2xl font-bold text-yellow-500 group-hover:text-yellow-400 transition-colors">
                    {siteSettings?.siteName || 'Livkors'}
                  </span>
                </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/" className="text-gray-700 hover:text-gray-900">Ana Sayfa</Link>
                <Link href="/products" className="text-gray-700 hover:text-gray-900">Ürünler</Link>
                <Link href="/categories" className="text-gray-700 hover:text-gray-900">Kategoriler</Link>
                <Link href="/about" className="text-blue-600 font-medium">Hakkımızda</Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/cart" className="relative">
                    <span className="sr-only">Sepet</span>
                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5a1 1 0 001 1h9a1 1 0 001-1v-4M9 21h6" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <span className="text-sm text-gray-700">Hoş geldin, {user.name}</span>
                </>
              ) : (
                <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {aboutData?.title || 'Hakkımızda'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            {aboutData?.heroTitle || 'Livkors - Kalite ve Şıklığın Buluştuğu Yer'}
          </p>
          <p className="text-lg text-blue-200 mt-4">
            {aboutData?.heroSubtitle || '2015 yılından beri kaliteli çanta üretiminde öncü firma'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Story */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {aboutData?.storyTitle || 'Hikayemiz'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <div className="text-lg leading-relaxed whitespace-pre-line">
                {aboutData?.storyContent || `Livkors, 2020 yılında kaliteli çanta ve aksesuar tutkunları tarafından kurulmuş, müşteri memnuniyetini her şeyin üstünde tutan bir markadır. Modern yaşamın ihtiyaçlarını karşılayan, şık ve fonksiyonel tasarımlar sunmayı misyon edinmiştir.

Her yaş ve tarza hitap eden geniş ürün yelpazemizle, günlük yaşamınızdan özel anlarınıza kadar her duruma uygun çanta seçenekleri sunuyoruz. Kalite kontrol süreçlerimizden geçen ürünlerimiz, uzun yıllar kullanabileceğiniz dayanıklılıkta üretilmektedir.`}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {aboutData?.visionTitle || 'Vizyonumuz'}
              </h2>
              <div className="text-gray-600 whitespace-pre-line">
                {aboutData?.visionContent || 'Çanta sektöründe kalite ve tasarım standardlarını belirlemeyi hedefliyoruz.'}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {aboutData?.missionTitle || 'Misyonumuz'}
              </h2>
              <div className="text-gray-600 whitespace-pre-line">
                {aboutData?.missionContent || 'Müşterilerimize en kaliteli ürünleri sunarak yaşam kalitelerini artırmak.'}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kalite</h3>
              <p className="text-gray-600">
                En yüksek kalite standartlarında, uzun ömürlü ve dayanıklı ürünler sunuyoruz.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">💖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Müşteri Memnuniyeti</h3>
              <p className="text-gray-600">
                Müşterilerimizin memnuniyeti bizim için en öncelikli hedeftir.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">İnovasyon</h3>
              <p className="text-gray-600">
                Sürekli yenilenen tasarımlar ve modern çözümlerle öncü olmaya devam ediyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl text-white p-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-yellow-500">
              Rakamlarla Livkors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Mutlu Müşteri</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Farklı Model</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-blue-100">Müşteri Memnuniyeti</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Destek Hizmeti</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Ekibimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers && teamMembers.length > 0 ? teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{member.emoji}</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.position}</p>
                {member.description && (
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                )}
              </div>
            )) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ahmet Kaya</h3>
                <p className="text-blue-600 mb-3">Kurucu & CEO</p>
                <p className="text-gray-600 text-sm">
                  15 yıllık moda ve tekstil sektörü deneyimi
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Bizimle İletişime Geçin
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sorularınız için bizimle iletişime geçmekten çekinmeyin. 
              Size en iyi hizmeti sunmak için buradayız.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ürünleri İncele
              </Link>
              <Link
                href="/messages"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Mesaj Gönder
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div>
                <div className="flex items-center space-x-2 mb-4">
                  <img 
                  src="/logo.jpg" 
                  alt="Livkors" 
                  className="h-8 w-8 rounded-full object-cover"
                />
                  <span className="text-2xl font-bold text-yellow-500">Livkors</span>
                </div>
              <p className="text-gray-400">
                Kaliteli çantalar ve mükemmel müşteri hizmetinde öncü markayız.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Ana Sayfa</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white">Ürünler</Link></li>
                <li><Link href="/categories" className="text-gray-400 hover:text-white">Kategoriler</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">Hakkımızda</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Müşteri Hizmetleri</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white">Hesabım</Link></li>
                <li><Link href="/cart" className="text-gray-400 hover:text-white">Sepetim</Link></li>
                <li><Link href="/messages" className="text-gray-400 hover:text-white">İletişim</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <div className="text-gray-400 space-y-2">
                <p>📧 {aboutData?.email || 'info@livkors.com'}</p>
                <p>📞 {aboutData?.phone || '+90 212 555 0123'}</p>
                <p>📍 {aboutData?.address || 'İstanbul, Türkiye'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Livkors. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 