'use client'

import { useActionState, useEffect } from 'react'
import { createCategory, updateCategory } from '@/lib/actions'

export default function CategoryForm({ editingCategory, onClose }) {
  const isEditing = !!editingCategory
  
  const categoryAction = async (prevState, formData) => {
    if (isEditing) {
      return await updateCategory(editingCategory.id, formData)
    } else {
      return await createCategory(formData)
    }
  }

  const [state, formAction, isPending] = useActionState(categoryAction, null)

  // Başarılı işlem sonrası modal'ı kapat
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        onClose()
        // Sayfayı yenile
        window.location.reload()
      }, 1000)
    }
  }, [state?.success, onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
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
                Kategori Adı
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingCategory?.name || ''}
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
                defaultValue={editingCategory?.description || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
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