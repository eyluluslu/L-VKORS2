'use client'

import { useState } from 'react'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Settings,
  Info
} from 'lucide-react'
import ProductForm from './ProductForm'
import CategoryForm from './CategoryForm'
import BannerForm from './BannerForm'
import SiteSettingsForm from './SiteSettingsForm'
import AboutForm from './AboutForm'
import TeamForm from './TeamForm'
import { deleteProduct, deleteCategory, changeUserRole, deleteUser } from '@/lib/actions'
import { deleteHeroBanner } from '@/lib/site-actions'

export default function AdminDashboard({ 
  initialProducts = [], 
  initialCategories = [], 
  users = [],
  stats = {},
  user,
  banners = [],
  siteSettings = null,
  aboutData = null,
  teamMembers = []
}) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showBannerForm, setShowBannerForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingBanner, setEditingBanner] = useState(null)

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleEditBanner = (banner) => {
    setEditingBanner(banner)
    setShowBannerForm(true)
  }

  const handleCloseProductForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
  }

  const handleCloseBannerForm = () => {
    setShowBannerForm(false)
    setEditingBanner(null)
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const result = await deleteProduct(productId)
      if (result.error) {
        alert(result.error)
      } else {
        window.location.reload()
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const result = await deleteCategory(categoryId)
      if (result.error) {
        alert(result.error)
      } else {
        window.location.reload()
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('Bu banner\'ı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const result = await deleteHeroBanner(bannerId)
      if (result.error) {
        alert(result.error)
      } else {
        window.location.reload()
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const handleChangeUserRole = async (userId, newRole) => {
    // Admin kendi rolünü değiştiremez
    if (userId === user.id) {
      alert('Kendi rolünüzü değiştiremezsiniz!')
      return
    }

    // Başka kullanıcıyı admin yapamaz (sadece bir admin olacak)
    if (newRole === 'ADMIN') {
      alert('Sistemde sadece bir admin olabilir!')
      return
    }

    if (!confirm(`Bu kullanıcının rolünü ${newRole === 'ADMIN' ? 'Admin' : 'Kullanıcı'} yapmak istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const result = await changeUserRole(userId, newRole)
      if (result.error) {
        alert(result.error)
      } else {
        alert(result.success)
        window.location.reload()
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }

    try {
      const result = await deleteUser(userId)
      if (result.error) {
        alert(result.error)
      } else {
        alert(result.success)
        window.location.reload()
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 shadow-sm rounded-lg h-fit">
          <nav className="p-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'banners' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ImageIcon className="h-5 w-5 mr-3" />
              Banner Yönetimi
            </button>
            
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'team' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Ekip Yönetimi
            </button>
            
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'products' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Package className="h-5 w-5 mr-3" />
              Ürünler
            </button>
            
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'categories' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Kategoriler
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'users' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Kullanıcılar
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'orders' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Siparişler
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'settings' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Site Ayarları
            </button>
            
            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg mb-2 ${
                activeTab === 'about' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Info className="h-5 w-5 mr-3" />
              Hakkımızda
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-8">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Toplam Kullanıcı</h3>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Toplam Ürün</h3>
                      <p className="text-2xl font-bold text-green-600">{stats.totalProducts || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ImageIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Aktif Banner</h3>
                      <p className="text-2xl font-bold text-purple-600">{banners.filter(b => b.isActive).length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Toplam Sipariş</h3>
                      <p className="text-2xl font-bold text-orange-600">{stats.totalOrders || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hızlı Erişim</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('banners')}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ImageIcon className="h-8 w-8 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Banner Yönetimi</h4>
                    <p className="text-sm text-gray-600">Ana sayfa banner'larını düzenleyin</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Ürün Yönetimi</h4>
                    <p className="text-sm text-gray-600">Ürünleri ekleyin, düzenleyin</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Users className="h-8 w-8 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Kullanıcı Yönetimi</h4>
                    <p className="text-sm text-gray-600">Kullanıcıları ve rolleri yönetin</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Banner Yönetimi</h2>
                  <p className="text-gray-600 mt-2">Ana sayfada gösterilecek banner'ları yönetin</p>
                </div>
                <button
                  onClick={() => setShowBannerForm(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Banner Ekle</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Görsel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Başlık
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sıra
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {banners && banners.length > 0 ? banners.map((banner) => (
                      <tr key={banner.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-24">
                              <img 
                                className="h-16 w-24 rounded object-cover" 
                                src={banner.imageUrl || '/placeholder-image.jpg'} 
                                alt={banner.title} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {banner.title}
                          </div>
                          {banner.subtitle && (
                            <div className="text-sm text-gray-500">
                              {banner.subtitle}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                                  <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full border-l-4 ${
                          banner.isActive 
                            ? 'bg-green-100 text-green-950 border-green-700' 
                            : 'bg-red-100 text-red-950 border-red-700'
                        }`}>
                            {banner.isActive ? (
                              <><Eye className="h-3 w-3 mr-1" />Aktif</>
                            ) : (
                              <><EyeOff className="h-3 w-3 mr-1" />Pasif</>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {banner.order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditBanner(banner)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Sil
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          Henüz banner eklenmemiş. İlk banner'ınızı ekleyin!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Ürünler</h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ürün Ekle</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ürün
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fiyat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {initialProducts && initialProducts.length > 0 ? initialProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={product.imageUrl || '/placeholder-image.jpg'} 
                                alt={product.name} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₺{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Sil
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          Henüz ürün bulunmuyor. Yeni ürün eklemek için "Ürün Ekle" butonunu kullanın.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Kategoriler</h2>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Kategori Ekle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {initialCategories && initialCategories.length > 0 ? initialCategories.map((category) => (
                  <div key={category.id} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description || 'Açıklama bulunmuyor'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {category.products?.length || 0} ürün
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditCategory(category)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">
                      Henüz kategori bulunmuyor. Yeni kategori eklemek için "Kategori Ekle" butonunu kullanın.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Kullanıcılar</h2>
                  <p className="text-gray-600 mt-2">Kayıtlı kullanıcıları görüntüleyin ve yönetin</p>
                </div>
                <div className="text-sm text-gray-500">
                  Toplam: {users?.length || 0} kullanıcı
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktivite
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users && users.length > 0 ? users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {userItem.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {userItem.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{userItem.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full border-l-4 ${
                            userItem.role === 'ADMIN' 
                              ? 'bg-amber-100 text-amber-950 border-amber-700' 
                              : 'bg-green-100 text-green-950 border-green-700'
                          }`}>
                            {userItem.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(userItem.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>📧 {userItem._count?.sentMessages || 0} mesaj</span>
                            <span>🛒 {userItem._count?.orders || 0} sipariş</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {userItem.id !== user.id && userItem.role !== 'ADMIN' && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleDeleteUser(userItem.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          {userItem.id === user.id && (
                            <span className="text-gray-400 text-xs">Sabit Admin (Değiştirilemez)</span>
                          )}
                          {userItem.id !== user.id && userItem.role === 'ADMIN' && (
                            <span className="text-gray-400 text-xs">Sabit Admin</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          Henüz kullanıcı bulunmuyor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Siparişler</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">Henüz sipariş bulunmuyor.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Site Ayarları</h2>
                <p className="text-gray-600 mt-2">Site genelindeki ayarları buradan yönetebilirsiniz</p>
              </div>
              
              <SiteSettingsForm 
                settings={siteSettings} 
                onSuccess={() => {
                  // Success callback
                }}
              />
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Ekip Yönetimi</h2>
                <p className="text-gray-600 mt-2">Ekip üyelerini buradan yönetebilirsiniz</p>
              </div>
              
              <TeamForm 
                initialMembers={teamMembers} 
              />
            </div>
          )}

          {activeTab === 'about' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Hakkımızda Sayfası</h2>
                <p className="text-gray-600 mt-2">Hakkımızda sayfasının içeriğini buradan düzenleyebilirsiniz</p>
              </div>
              
              <AboutForm 
                aboutData={aboutData} 
                onSuccess={() => {
                  // Success callback
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Banner Form Modal */}
      {showBannerForm && (
        <BannerForm
          banner={editingBanner}
          onClose={handleCloseBannerForm}
        />
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          categories={initialCategories}
          onClose={handleCloseProductForm}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCloseCategoryForm}
        />
      )}
    </>
  )
} 