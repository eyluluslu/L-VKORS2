import { getCurrentUser, getInboxMessages, getSentMessages } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail, Send, Inbox, MessageSquare, Plus } from 'lucide-react'
import MessageList from '@/components/MessageList'

export default async function MessagesPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const [inboxMessages, sentMessages] = await Promise.all([
    getInboxMessages(),
    getSentMessages()
  ])

  const unreadCount = inboxMessages.filter(msg => !msg.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
            </div>
            <Link
              href="/messages/compose"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Yeni Mesaj
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <nav className="space-y-2">
                <a
                  href="#inbox"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 bg-blue-50 text-blue-700"
                >
                  <Inbox className="h-5 w-5 mr-3" />
                  Gelen Kutusu
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </a>
                <a
                  href="#sent"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <Send className="h-5 w-5 mr-3" />
                  Gönderilen
                </a>
              </nav>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">İstatistikler</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Mesaj:</span>
                  <span className="font-medium">{inboxMessages.length + sentMessages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Okunmamış:</span>
                  <span className="font-medium text-red-600">{unreadCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gönderilen:</span>
                  <span className="font-medium">{sentMessages.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Gelen Kutusu */}
            <div id="inbox" className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Inbox className="h-5 w-5 mr-2" />
                  Gelen Kutusu ({inboxMessages.length})
                </h2>
              </div>
              <MessageList messages={inboxMessages} type="inbox" />
            </div>

            {/* Gönderilen Mesajlar */}
            <div id="sent" className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Gönderilen Mesajlar ({sentMessages.length})
                </h2>
              </div>
              <MessageList messages={sentMessages} type="sent" />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 