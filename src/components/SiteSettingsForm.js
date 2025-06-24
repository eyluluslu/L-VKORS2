'use client'

import { useState } from 'react'
import { updateSiteSettings } from '@/lib/site-actions'

export default function SiteSettingsForm({ settings = null, onSuccess }) {
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || 'Livkors',
    siteDescription: settings?.siteDescription || 'Kaliteli çantalar ve mükemmel müşteri hizmetinde öncü markayız',
    logoUrl: settings?.logoUrl || '',
    heroTitle: settings?.heroTitle || 'Özel Tasarım Çantalar',
    heroSubtitle: settings?.heroSubtitle || 'Her tarza uygun kaliteli çantalar. Kadın, erkek ve özel koleksiyonlar.',
    footerText: settings?.footerText || 'Kaliteli çantalar ve mükemmel müşteri hizmetinde öncü markayız.',
    socialFacebook: settings?.socialFacebook || '',
    socialInstagram: settings?.socialInstagram || '',
    socialTwitter: settings?.socialTwitter || '',
    socialLinkedin: settings?.socialLinkedin || '',
    metaTitle: settings?.metaTitle || 'Livkors - Kaliteli Çantalar',
    metaDescription: settings?.metaDescription || 'En kaliteli çantalar, uygun fiyatlar ve hızlı teslimat'
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        alert('Sadece JPG, PNG, WebP ve SVG formatları desteklenir!')
        return
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo dosyası 2MB\'dan büyük olamaz!')
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleLogoUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          logoUrl: result.imageUrl
        }))
        setSelectedFile(null)
        alert('Logo başarıyla yüklendi!')
      } else {
        alert(result.error || 'Logo yükleme hatası')
      }
    } catch (error) {
      alert('Logo yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key] || '')
      })

      const result = await updateSiteSettings(formDataToSend)

      if (result.success) {
        alert(result.message)
        onSuccess?.()
        window.location.reload()
      } else {
        alert(result.message || 'Bir hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">Site Ayarları</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Genel Bilgiler */}
        <div>
          <h4 className="text-lg font-medium mb-4">Genel Bilgiler</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Adı
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Açıklaması
              </label>
              <input
                type="text"
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div>
          <h4 className="text-lg font-medium mb-4">Logo</h4>
          
          <div className="space-y-4">
            {/* Logo Yükleme */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-sm text-gray-600 mb-3">
                  Site logosunu bilgisayarınızdan seçin ve yükleyin (JPG, PNG, WebP, SVG - Max 2MB)
                </p>
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="logo-upload"
                />
                
                <div className="flex items-center justify-center space-x-2">
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Logo Seç
                  </label>
                  
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleLogoUpload}
                      disabled={uploading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {uploading ? 'Yükleniyor...' : 'Yükle'}
                    </button>
                  )}
                </div>
                
                {selectedFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    Seçilen dosya: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Logo Önizleme */}
            {formData.logoUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Önizleme
                </label>
                <div className="border rounded-md p-4 bg-gray-50">
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo preview" 
                    className="h-16 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ana Sayfa */}
        <div>
          <h4 className="text-lg font-medium mb-4">Ana Sayfa</h4>
          <div className="space-y-4">
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
              <textarea
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div>
          <h4 className="text-lg font-medium mb-4">Sosyal Medya</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                name="socialFacebook"
                value={formData.socialFacebook}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/livkors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="socialInstagram"
                value={formData.socialInstagram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/livkors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="url"
                name="socialTwitter"
                value={formData.socialTwitter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/livkors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                name="socialLinkedin"
                value={formData.socialLinkedin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/livkors"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div>
          <h4 className="text-lg font-medium mb-4">SEO Ayarları</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Başlık
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Açıklama
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Footer Metni
              </label>
              <textarea
                name="footerText"
                value={formData.footerText}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
} 