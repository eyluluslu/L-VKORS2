'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setSuccess(true)
        setEmail('')
      } else {
        setMessage(data.error)
        setSuccess(false)
      }
    } catch (error) {
      setMessage('Bağlantı hatası. Lütfen tekrar deneyin.')
      setSuccess(false)
    }

    setLoading(false)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          📧 Özel Fırsatları Kaçırma!
        </h2>
        <p className="text-xl text-purple-200 mb-8">
          Yeni ürünler, kampanyalar ve özel indirimlerden ilk sen haberdar ol
        </p>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            success 
              ? 'bg-green-900/50 text-green-200 border border-green-700' 
              : 'bg-red-900/50 text-red-200 border border-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gönderiliyor...' : 'Abone Ol 🚀'}
          </button>
        </form>
        
        <p className="text-sm text-purple-300 mt-4">
          ✨ Abone olarak %20 indirim kuponu kazan!
        </p>
      </div>
    </section>
  )
} 