'use client'

import { useState, useActionState } from 'react'
import { User, Mail, MessageSquare, Send } from 'lucide-react'
import { sendMessage } from '@/lib/actions'
import { useRouter } from 'next/navigation'

export default function ComposeForm() {
  const [state, formAction, isPending] = useActionState(sendMessage, null)
  const router = useRouter()

  // Başarılı gönderim durumunda mesajlar sayfasına yönlendir
  if (state?.success) {
    setTimeout(() => {
      router.push('/messages')
    }, 2000)
  }

  return (
    <>
      {state?.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      {state?.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{state.success}</p>
          <p className="text-xs text-green-500 mt-1">2 saniye içinde mesajlar sayfasına yönlendiriliyorsunuz...</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="receiverEmail" className="block text-sm font-medium text-gray-700">
            Alıcı Email Adresi
          </label>
          <div className="mt-1 relative">
            <input
              id="receiverEmail"
              name="receiverEmail"
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="ornek@email.com"
            />
            <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mesaj göndermek istediğiniz kullanıcının email adresini girin
          </p>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Konu
          </label>
          <div className="mt-1 relative">
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Mesaj konusu"
            />
            <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Mesaj İçeriği
          </label>
          <div className="mt-1 relative">
            <textarea
              id="content"
              name="content"
              rows={8}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical"
              placeholder="Mesajınızı buraya yazın..."
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            En az 10 karakter yazın
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/messages')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isPending || state?.success}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isPending ? 'Gönderiliyor...' : 'Mesajı Gönder'}
          </button>
        </div>
      </form>
    </>
  )
} 