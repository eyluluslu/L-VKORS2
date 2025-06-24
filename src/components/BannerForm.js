'use client'

import { useState } from 'react'
import { createHeroBannerFromObject, updateHeroBannerFromObject } from '@/lib/site-actions'

export default function BannerForm({ banner = null, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    description: banner?.description || '',
    imageUrl: banner?.imageUrl || '',
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.order || 0
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Form submit - Current formData:', formData)
    console.log('Selected file:', selectedFile)
    
    // Eğer dosya seçilmiş ama henüz yüklenmemişse uyar
    if (selectedFile && !formData.imageUrl) {
      alert('Seçtiğiniz dosyayı yüklemek için "Yükle" butonuna tıklayın!')
      return
    }
    
    // Görsel kontrolü
    if (!formData.imageUrl) {
      console.log('ImageUrl boş:', formData.imageUrl)
      alert('Lütfen bir görsel yükleyin veya URL girin!')
      return
    }
    
    setLoading(true)

    try {
      let result
      if (banner) {
        result = await updateHeroBannerFromObject(banner.id, formData)
      } else {
        result = await createHeroBannerFromObject(formData)
      }

      if (result.success) {
        alert(result.message)
        onSuccess?.()
        onClose()
        // Reload the page to show updated banners
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Dosya türü kontrolü
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Sadece JPG, PNG ve WebP formatları desteklenir!')
        return
      }
      
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan büyük olamaz!')
        return
      }
      
      setSelectedFile(file)
      
      // Otomatik yükleme
      await handleFileUploadWithFile(file)
    }
  }

  const handleFileUploadWithFile = async (fileToUpload = selectedFile) => {
    if (!fileToUpload) return

    setUploading(true)
    try {
      console.log('Upload başlıyor...', fileToUpload.name)
      const uploadFormData = new FormData()
      uploadFormData.append('file', fileToUpload)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      console.log('Upload response status:', response.status)
      const result = await response.json()
      console.log('Upload result:', result)

      if (result.success) {
        console.log('Setting imageUrl to:', result.imageUrl)
        setFormData(prev => {
          const newFormData = {
            ...prev,
            imageUrl: result.imageUrl
          }
          console.log('New formData:', newFormData)
          return newFormData
        })
        setSelectedFile(null)
        alert('Dosya başarıyla yüklendi: ' + result.imageUrl)
      } else {
        console.error('Upload error:', result.error)
        alert('Dosya yükleme hatası: ' + (result.error || 'Bilinmeyen hata'))
      }
    } catch (error) {
      console.error('Upload exception:', error)
      alert('Dosya yüklenirken bir hata oluştu: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = () => handleFileUploadWithFile()

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {banner ? 'Banner Düzenle' : 'Yeni Banner Oluştur'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Banner başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Başlık (İsteğe bağlı)
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Banner alt başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Banner açıklaması"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Görseli
              </label>
              
              {/* Dosya Yükleme Seçenekleri */}
              <div className="space-y-4">
                {/* Dosya Yükleme */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-sm text-gray-600 mb-3">
                      Bilgisayarınızdan bir görsel seçin (JPG, PNG, WebP - Max 5MB)<br/>
                      <strong>Dosya seçildiğinde otomatik olarak yüklenecektir.</strong>
                    </p>
                    
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    
                    <div className="flex items-center justify-center space-x-2">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Dosya Seç
                      </label>
                      
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          disabled={uploading}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {uploading ? 'Yükleniyor...' : 'Yükle'}
                        </button>
                      )}
                    </div>
                    
                    {selectedFile && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Seçilen dosya: {selectedFile.name}
                        </p>
                        <p className="text-xs text-orange-600 font-medium">
                          ⚠️ Dosyayı yüklemek için "Yükle" butonuna tıklayın!
                        </p>
                      </div>
                    )}
                    
                    {formData.imageUrl && !selectedFile && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600 font-medium">
                          ✅ Görsel başarıyla yüklendi!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sıralama
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Aktif
              </label>
            </div>

            {/* Debug Paneli */}
            <div className="bg-gray-100 p-3 rounded text-xs">
              <strong>Debug Bilgileri:</strong><br/>
              ImageUrl: {formData.imageUrl || 'BOŞ'}<br/>
              Selected File: {selectedFile ? selectedFile.name : 'YOK'}<br/>
              Uploading: {uploading ? 'EVET' : 'HAYIR'}
            </div>

            {formData.imageUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Önizleme
                </label>
                <img 
                  src={formData.imageUrl} 
                  alt="Banner preview" 
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : (banner ? 'Güncelle' : 'Oluştur')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 