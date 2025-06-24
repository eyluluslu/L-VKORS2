import { getCurrentUser } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import ComposeForm from '@/components/ComposeForm'

export default async function ComposePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/messages"
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex items-center">
              <Send className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Yeni Mesaj</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Mesaj Gönder</h2>
            <p className="text-gray-600 mt-1">
              Diğer kullanıcılara mesaj göndermek için alıcının email adresini girin.
            </p>
          </div>
          
          <div className="p-6">
            <ComposeForm />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 İpucu</h3>
          <p className="text-sm text-blue-700">
            Mesaj göndermek için alıcının sistemde kayıtlı email adresini kullanın. 
            Sadece kayıtlı kullanıcılara mesaj gönderebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
} 