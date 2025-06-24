'use client'

import { useActionState, useEffect, useState } from 'react'
import { createProduct, updateProduct } from '@/lib/actions'

export default function ProductForm({ categories, editingProduct, onClose }) {
  const isEditing = !!editingProduct
  const [imagePreview, setImagePreview] = useState(editingProduct?.imageUrl || '')
  const [imageType, setImageType] = useState('url') // 'url' or 'file'
  
  const productAction = async (prevState, formData) => {
    if (isEditing) {
      return await updateProduct(editingProduct.id, formData)
    } else {
      return await createProduct(formData)
    }
  }

  const [state, formAction, isPending] = useActionState(productAction, null)

  // Başarılı işlem sonrası modal'ı kapat
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        onClose()
        // Sayfayı yenile
        window.location.reload()
      }, 1500) // Biraz daha uzun bekle
    }
  }, [state?.success, onClose])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (e) => {
    setImagePreview(e.target.value)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </h3>

        {state?.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}

        {state?.success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{state.success}</p>
          </div>
        )}

        <form action={formAction}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingProduct?.name || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                name="description"
                defaultValue={editingProduct?.description || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat (₺)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Resim Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Resmi
              </label>
              
              {/* Resim Tipi Seçimi */}
              <div className="flex space-x-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="url"
                    checked={imageType === 'url'}
                    onChange={(e) => setImageType(e.target.value)}
                    className="mr-2"
                  />
                  URL ile
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    checked={imageType === 'file'}
                    onChange={(e) => setImageType(e.target.value)}
                    className="mr-2"
                  />
                  Dosya Yükle
                </label>
              </div>

              {imageType === 'url' ? (
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/resim.jpg"
                  defaultValue={editingProduct?.imageUrl || ''}
                  onChange={handleUrlChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input type="hidden" name="imageUrl" value={imagePreview} />
                  <p className="text-xs text-gray-500 mt-1">
                    Not: Dosya yükleme demo amaçlıdır. Gerçek projede image hosting servisi kullanılmalıdır.
                  </p>
                </div>
              )}

              {/* Resim Önizlemesi */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Önizleme:</p>
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    className="w-32 h-32 object-cover border rounded-md"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok Adedi
              </label>
              <input
                type="number"
                name="stock"
                defaultValue={editingProduct?.stock || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                name="categoryId"
                defaultValue={editingProduct?.categoryId || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              disabled={isPending || state?.success}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  İşleniyor...
                </div>
              ) : state?.success ? (
                'Başarılı! Kapatılıyor...'
              ) : (
                isEditing ? 'Güncelle' : 'Ekle'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 