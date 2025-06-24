import { getCurrentUser } from '@/lib/actions'
import { getSiteSettings } from '@/lib/site-actions'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function ProfilePage() {
  const [user, siteSettingsResult] = await Promise.all([
    getCurrentUser(),
    getSiteSettings()
  ])
  
  if (!user) {
    redirect('/login')
  }
  
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Ana Sayfa</Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600">Ürünler</Link>
              <Link href="/messages" className="text-gray-700 hover:text-blue-600">Mesajlar</Link>
              <Link href="/profile" className="text-blue-600 font-medium">Profil</Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hoş geldin, <span className="font-medium">{user.name}</span>
                {user.role === 'ADMIN' && <span className="ml-1 px-2 py-1 bg-amber-100 text-amber-950 text-xs rounded font-bold border-l-4 border-amber-700">Admin</span>}
              </span>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <div className="text-3xl">👤</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Profili</h1>
              <p className="text-gray-600">Hesap bilgilerinizi görüntüleyin ve güncelleyin</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kullanıcı Bilgileri */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil Bilgileri</h2>
              <ProfileForm user={user} />
            </div>
          </div>

          {/* Hesap Özeti */}
          <div className="space-y-6">
            {/* Hesap Durumu */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Durumu</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Üyelik Tarihi:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kullanıcı Rolü:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold border-l-4 ${
                    user.role === 'ADMIN' 
                      ? 'bg-amber-100 text-amber-950 border-amber-700'
                      : 'bg-green-100 text-green-950 border-green-700'
                  }`}>
                    {user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hesap Durumu:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-950 rounded text-xs font-bold border-l-4 border-green-700">
                    Aktif
                  </span>
                </div>
              </div>
            </div>

            {/* Hızlı Eylemler */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Eylemler</h3>
              <div className="space-y-3">
                <Link
                  href="/messages"
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>💬 Mesajlarım</span>
                  <span>→</span>
                </Link>
                
                <Link
                  href="/cart"
                  className="w-full bg-green-50 hover:bg-green-100 text-green-900 px-4 py-3 rounded-lg transition-colors flex items-center justify-between font-bold"
                >
                  <span>🛒 Sepetim</span>
                  <span>→</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="w-full bg-red-50 hover:bg-red-100 text-red-900 px-4 py-3 rounded-lg transition-colors flex items-center justify-between font-bold"
                  >
                    <span>⚙️ Admin Panel</span>
                    <span>→</span>
                  </Link>
                )}

                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-between">
                  <span>📊 Sipariş Geçmişi</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Güvenlik */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-2">
                  Şifre değiştirmek için profil düzenleme bölümündeki "🔑 Şifre Değiştir" butonunu kullanın.
                </div>
                <div className="pt-3 border-t">
                  <LogoutButton className="w-full bg-red-50 hover:bg-red-100 text-red-900 px-4 py-3 rounded-lg transition-colors font-bold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 