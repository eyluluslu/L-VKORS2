'use client'

import { useState, useEffect } from 'react'
import { updateProfile, updatePassword, getUserAddresses, createAddress, updateAddress, deleteAddress, getUserPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '@/lib/actions'

export default function ProfileForm({ user }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Profile form data
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || ''
  })

  // Address data
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressFormData, setAddressFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Türkiye',
    isDefault: false
  })

  // Payment method data
  const [paymentMethods, setPaymentMethods] = useState([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [paymentFormData, setPaymentFormData] = useState({
    type: 'CREDIT_CARD',
    title: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    isDefault: false
  })

  // Load addresses and payment methods
  useEffect(() => {
    loadAddresses()
    loadPaymentMethods()
  }, [])

  const loadAddresses = async () => {
    const result = await getUserAddresses()
      if (result.success) {
      setAddresses(result.addresses)
    }
  }

  const loadPaymentMethods = async () => {
    const result = await getUserPaymentMethods()
    if (result.success) {
      setPaymentMethods(result.paymentMethods)
    }
  }

  const getPaymentTypeLabel = (type) => {
    const labels = {
      CREDIT_CARD: 'Kredi Kartı',
      DEBIT_CARD: 'Banka Kartı',
      PAYPAL: 'PayPal',
      BANK_TRANSFER: 'Banka Havalesi'
    }
    return labels[type] || type
  }

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-lg mb-6 border-l-4 ${
          message.includes('başarıyla') 
            ? 'bg-emerald-900/50 text-emerald-200 border border-emerald-800 border-l-emerald-500 font-bold' 
            : 'bg-amber-900/50 text-amber-200 border border-amber-800 border-l-amber-500 font-bold'
        }`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-slate-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
            }`}
          >
            👤 Profil Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'addresses'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
            }`}
          >
            📍 Adreslerim
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
            }`}
          >
            💳 Ödeme Yöntemlerim
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {!isEditing ? (
            <>
          {/* Ad Soyad */}
          <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
              Ad Soyad
            </label>
                <div className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100">
                  {user.name}
                </div>
          </div>

          {/* Email */}
          <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
              E-posta Adresi
            </label>
                <div className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100">
                  {user.email}
                </div>
          </div>

              {/* Kullanıcı ID */}
          <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
              Kullanıcı ID
            </label>
                <div className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-400 text-sm font-mono">
              {user.id}
            </div>
          </div>

              {/* Üyelik Tarihi */}
          <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
              Üyelik Tarihi
            </label>
                <div className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100">
              {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

              {/* Butonlar */}
              <div className="flex space-x-4 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ✏️ Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  🔑 Şifre Değiştir
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Profil Düzenleme Formu */}
              <form onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)
                setMessage('')

                try {
                  const result = await updateProfile(formData)
                  
                  if (result.success) {
                    setMessage('Profil bilgileri başarıyla güncellendi!')
                    setIsEditing(false)
                    // Sayfa yenilenmesi için
                    window.location.reload()
                  } else {
                    setMessage(result.error || 'Profil güncellenirken hata oluştu')
                  }
                } catch (error) {
                  setMessage('Bağlantı hatası: ' + error.message)
                }
                
                setLoading(false)
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                    placeholder="Ad ve soyadınızı girin"
                  />
                </div>

          <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    E-posta Adresi *
            </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        name: user.name || '',
                        email: user.email || ''
                      })
                    }}
                    disabled={loading}
                    className="flex-1 bg-slate-600 text-slate-200 py-2 rounded-lg hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Adreslerim</h3>
            <button
              onClick={() => {
                setAddressFormData({
                  title: '',
                  firstName: '',
                  lastName: '',
                  company: '',
                  phone: '',
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: 'Türkiye',
                  isDefault: false
                })
                setEditingAddress(null)
                setShowAddressForm(true)
              }}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ Yeni Adres Ekle
            </button>
          </div>

          {/* Address List */}
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border border-slate-600 bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-100">{address.title}</h4>
                      {address.isDefault && (
                        <span className="bg-emerald-900 text-emerald-300 text-xs px-2 py-1 rounded-full">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200">{address.firstName} {address.lastName}</p>
                    {address.company && <p className="text-slate-400">{address.company}</p>}
                    <p className="text-slate-400">{address.phone}</p>
                    <p className="text-slate-400">{address.address}</p>
                    <p className="text-slate-400">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="text-slate-400">{address.country}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setAddressFormData(address)
                        setEditingAddress(address)
                        setShowAddressForm(true)
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return
                        setLoading(true)
                        const result = await deleteAddress(address.id)
                        if (result.success) {
                          setMessage('Adres başarıyla silindi!')
                          loadAddresses()
                        } else {
                          setMessage(result.error)
                        }
                        setLoading(false)
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                Henüz adres eklenmemiş.
              </div>
            )}
          </div>
            </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payments' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Ödeme Yöntemlerim</h3>
            <button
              onClick={() => {
                setPaymentFormData({
                  type: 'CREDIT_CARD',
                  title: '',
                  cardNumber: '',
                  cardHolder: '',
                  expiryDate: '',
                  isDefault: false
                })
                setEditingPayment(null)
                setShowPaymentForm(true)
              }}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ Yeni Ödeme Yöntemi Ekle
            </button>
          </div>

          {/* Payment Method List */}
          <div className="space-y-4">
            {paymentMethods.map((payment) => (
              <div key={payment.id} className="border border-slate-600 bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-100">{payment.title}</h4>
                      {payment.isDefault && (
                        <span className="bg-emerald-900 text-emerald-300 text-xs px-2 py-1 rounded-full">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200">{getPaymentTypeLabel(payment.type)}</p>
                    {payment.cardNumber && (
                      <p className="text-slate-400">**** **** **** {payment.cardNumber}</p>
                    )}
                    {payment.cardHolder && <p className="text-slate-400">{payment.cardHolder}</p>}
                    {payment.expiryDate && <p className="text-slate-400">Son kullanma: {payment.expiryDate}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setPaymentFormData(payment)
                        setEditingPayment(payment)
                        setShowPaymentForm(true)
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Bu ödeme yöntemini silmek istediğinizden emin misiniz?')) return
                        setLoading(true)
                        const result = await deletePaymentMethod(payment.id)
                        if (result.success) {
                          setMessage('Ödeme yöntemi başarıyla silindi!')
                          loadPaymentMethods()
                        } else {
                          setMessage(result.error)
                        }
                        setLoading(false)
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {paymentMethods.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                Henüz ödeme yöntemi eklenmemiş.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-slate-600">
            <h3 className="text-xl font-semibold mb-4 text-slate-100">
              {editingAddress ? 'Adres Düzenle' : 'Yeni Adres Ekle'}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              setLoading(true)
              setMessage('')

              try {
                let result
                if (editingAddress) {
                  result = await updateAddress(editingAddress.id, addressFormData)
                } else {
                  result = await createAddress(addressFormData)
                }

                if (result.success) {
                  setMessage(`Adres başarıyla ${editingAddress ? 'güncellendi' : 'eklendi'}!`)
                  setShowAddressForm(false)
                  setEditingAddress(null)
                  loadAddresses()
                } else {
                  setMessage(result.error)
                }
              } catch (error) {
                setMessage('Bağlantı hatası: ' + error.message)
              }

              setLoading(false)
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Adres Başlığı *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={addressFormData.title}
                    onChange={(e) => setAddressFormData({...addressFormData, title: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                    placeholder="Ev, İş, Diğer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                    placeholder="+90 555 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={addressFormData.firstName}
                    onChange={(e) => setAddressFormData({...addressFormData, firstName: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={addressFormData.lastName}
                    onChange={(e) => setAddressFormData({...addressFormData, lastName: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Şirket (İsteğe bağlı)
                </label>
                <input
                  type="text"
                  name="company"
                  value={addressFormData.company}
                  onChange={(e) => setAddressFormData({...addressFormData, company: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Adres *
                </label>
                <textarea
                  name="address"
                  value={addressFormData.address}
                  onChange={(e) => setAddressFormData({...addressFormData, address: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  placeholder="Mahalle, sokak, no..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Şehir *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    İl/Bölge *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">
                    Posta Kodu *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={addressFormData.zipCode}
                    onChange={(e) => setAddressFormData({...addressFormData, zipCode: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Ülke *
                </label>
                <input
                  type="text"
                  name="country"
                  value={addressFormData.country}
                  onChange={(e) => setAddressFormData({...addressFormData, country: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressFormData.isDefault}
                  onChange={(e) => setAddressFormData({...addressFormData, isDefault: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-900"
                />
                <label className="ml-2 block text-sm text-slate-200">
                  Varsayılan adres olarak ayarla
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Kaydediliyor...' : (editingAddress ? 'Güncelle' : 'Kaydet')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false)
                    setEditingAddress(null)
                  }}
                  disabled={loading}
                  className="flex-1 bg-slate-600 text-slate-200 py-2 rounded-lg hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Method Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 border border-slate-600">
            <h3 className="text-xl font-semibold mb-4 text-slate-100">
              {editingPayment ? 'Ödeme Yöntemi Düzenle' : 'Yeni Ödeme Yöntemi Ekle'}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              setLoading(true)
              setMessage('')

              try {
                let result
                if (editingPayment) {
                  result = await updatePaymentMethod(editingPayment.id, paymentFormData)
                } else {
                  result = await createPaymentMethod(paymentFormData)
                }

                if (result.success) {
                  setMessage(`Ödeme yöntemi başarıyla ${editingPayment ? 'güncellendi' : 'eklendi'}!`)
                  setShowPaymentForm(false)
                  setEditingPayment(null)
                  loadPaymentMethods()
                } else {
                  setMessage(result.error)
                }
              } catch (error) {
                setMessage('Bağlantı hatası: ' + error.message)
              }

              setLoading(false)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Ödeme Türü *
                </label>
                <select
                  name="type"
                  value={paymentFormData.type}
                  onChange={(e) => setPaymentFormData({...paymentFormData, type: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                >
                  <option value="CREDIT_CARD">Kredi Kartı</option>
                  <option value="DEBIT_CARD">Banka Kartı</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="BANK_TRANSFER">Banka Havalesi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Başlık *
                </label>
                <input
                  type="text"
                  name="title"
                  value={paymentFormData.title}
                  onChange={(e) => setPaymentFormData({...paymentFormData, title: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  placeholder="Ana Kart, İş Kartı..."
                />
              </div>

              {(paymentFormData.type === 'CREDIT_CARD' || paymentFormData.type === 'DEBIT_CARD') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">
                      Kart Numarası *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentFormData.cardNumber}
                      onChange={(e) => setPaymentFormData({...paymentFormData, cardNumber: e.target.value})}
                      required
                      maxLength={19}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">
                      Kart Sahibi *
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={paymentFormData.cardHolder}
                      onChange={(e) => setPaymentFormData({...paymentFormData, cardHolder: e.target.value})}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                      placeholder="AD SOYAD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">
                      Son Kullanma Tarihi *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentFormData.expiryDate}
                      onChange={(e) => setPaymentFormData({...paymentFormData, expiryDate: e.target.value})}
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={paymentFormData.isDefault}
                  onChange={(e) => setPaymentFormData({...paymentFormData, isDefault: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-900"
                />
                <label className="ml-2 block text-sm text-slate-200">
                  Varsayılan ödeme yöntemi olarak ayarla
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Kaydediliyor...' : (editingPayment ? 'Güncelle' : 'Kaydet')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false)
                    setEditingPayment(null)
                  }}
                  disabled={loading}
                  className="flex-1 bg-slate-600 text-slate-200 py-2 rounded-lg hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 border border-slate-600">
            <h3 className="text-xl font-semibold mb-4 text-slate-100">Şifre Değiştir</h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              setLoading(true)
              setMessage('')

              const formData = new FormData(e.target)
              const currentPassword = formData.get('currentPassword')
              const newPassword = formData.get('newPassword') 
              const confirmPassword = formData.get('confirmPassword')

              if (!currentPassword || !newPassword || !confirmPassword) {
                setMessage('Tüm şifre alanları doldurulmalıdır')
                setLoading(false)
                return
              }

              if (newPassword !== confirmPassword) {
                setMessage('Yeni şifre ve onay şifresi eşleşmiyor')
                setLoading(false)
                return
              }

              if (newPassword.length < 6) {
                setMessage('Yeni şifre en az 6 karakter olmalıdır')
                setLoading(false)
                return
              }

              try {
                const result = await updatePassword({currentPassword, newPassword, confirmPassword})
                
                if (result.success) {
                  setMessage('Şifre başarıyla değiştirildi!')
                  setIsChangingPassword(false)
                } else {
                  setMessage(result.error || 'Şifre değiştirme sırasında hata oluştu')
                }
              } catch (error) {
                setMessage('Bağlantı hatası: ' + error.message)
              }
              
              setLoading(false)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  placeholder="Mevcut şifrenizi girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  placeholder="Yeni şifrenizi girin (en az 6 karakter)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Yeni Şifre Onay
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Değiştiriliyor...' : 'Şifre Değiştir'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  disabled={loading}
                  className="flex-1 bg-slate-600 text-slate-200 py-2 rounded-lg hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 