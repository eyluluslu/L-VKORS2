'use client'

import { useState } from 'react'
import { updateAboutPage } from '@/lib/about-actions'

export default function AboutForm({ aboutData = null, onSuccess }) {
  const [formData, setFormData] = useState({
    title: aboutData?.title || 'Hakkımızda',
    heroTitle: aboutData?.heroTitle || 'Livkors - Kalite ve Şıklığın Buluştuğu Yer',
    heroSubtitle: aboutData?.heroSubtitle || '2015 yılından beri kaliteli çanta üretiminde öncü firma',
    storyTitle: aboutData?.storyTitle || 'Hikayemiz',
    storyContent: aboutData?.storyContent || 'Livkors, 2015 yılında kaliteli çanta üretimi amacıyla kurulmuştur...',
    visionTitle: aboutData?.visionTitle || 'Vizyonumuz',
    visionContent: aboutData?.visionContent || 'Çanta sektöründe kalite ve tasarım standardlarını belirlemeyi hedefliyoruz...',
    missionTitle: aboutData?.missionTitle || 'Misyonumuz',
    missionContent: aboutData?.missionContent || 'Müşterilerimize en kaliteli ürünleri sunarak yaşam kalitelerini artırmak...',
    phone: aboutData?.phone || '+90 212 555 0123',
    email: aboutData?.email || 'info@livkors.com',
    address: aboutData?.address || 'İstanbul, Türkiye'
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    console.log('AboutForm: Güncelleme başlıyor...', formData)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key] || '')
      })

      console.log('AboutForm: FormData hazırlandı')
      
      const result = await updateAboutPage(formDataToSend)
      
      console.log('AboutForm: Sunucu yanıtı:', result)

      if (result.success) {
        alert(result.message)
        onSuccess?.()
        window.location.reload()
      } else {
        alert(result.message || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('AboutForm: Hata:', error)
      alert('Bir hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">Hakkımızda Sayfası Yönetimi</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ana Bilgiler */}
        <div>
          <h4 className="text-lg font-medium mb-4">Ana Bilgiler</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa Başlığı
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ana Başlık
              </label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Başlık
              </label>
              <input
                type="text"
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Hikayemiz */}
        <div>
          <h4 className="text-lg font-medium mb-4">Hikayemiz</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bölüm Başlığı
              </label>
              <input
                type="text"
                name="storyTitle"
                value={formData.storyTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
                name="storyContent"
                value={formData.storyContent}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şirketinizin hikayesini buraya yazın..."
              />
            </div>
          </div>
        </div>

        {/* Vizyonumuz */}
        <div>
          <h4 className="text-lg font-medium mb-4">Vizyonumuz</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bölüm Başlığı
              </label>
              <input
                type="text"
                name="visionTitle"
                value={formData.visionTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
                name="visionContent"
                value={formData.visionContent}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vizyonunuzu buraya yazın..."
              />
            </div>
          </div>
        </div>

        {/* Misyonumuz */}
        <div>
          <h4 className="text-lg font-medium mb-4">Misyonumuz</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bölüm Başlığı
              </label>
              <input
                type="text"
                name="missionTitle"
                value={formData.missionTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
                name="missionContent"
                value={formData.missionContent}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Misyonunuzu buraya yazın..."
              />
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div>
          <h4 className="text-lg font-medium mb-4">İletişim Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+90 212 555 0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@livkors.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şirket adresinizi buraya yazın..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Hakkımızda Bilgilerini Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
} 