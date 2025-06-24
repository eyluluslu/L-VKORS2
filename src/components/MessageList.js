'use client'

import { useState } from 'react'
import { Mail, MailOpen, Clock, User, Trash2 } from 'lucide-react'
import { markMessageAsRead, deleteMessage } from '@/lib/actions'

export default function MessageList({ messages, type }) {
  const [expandedMessage, setExpandedMessage] = useState(null)

  const handleToggleMessage = async (messageId, isRead) => {
    if (expandedMessage === messageId) {
      setExpandedMessage(null)
    } else {
      setExpandedMessage(messageId)
      
      // Eğer mesaj okunmamış ve gelen kutusunda ise, okundu olarak işaretle
      if (type === 'inbox' && !isRead) {
        await markMessageAsRead(messageId)
      }
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      await deleteMessage(messageId)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Az önce'
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {type === 'inbox' ? 'Gelen mesaj yok' : 'Gönderilen mesaj yok'}
        </h3>
        <p className="text-gray-600">
          {type === 'inbox' 
            ? 'Henüz size gönderilmiş bir mesaj bulunmuyor.' 
            : 'Henüz hiç mesaj göndermediniz.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {messages.map((message) => {
        const isExpanded = expandedMessage === message.id
        const otherUser = type === 'inbox' ? message.sender : message.receiver
        const isUnread = type === 'inbox' && !message.isRead

        return (
          <div key={message.id} className="hover:bg-gray-50 transition-colors">
            <div
              className={`p-4 cursor-pointer ${isUnread ? 'bg-blue-50' : ''}`}
              onClick={() => handleToggleMessage(message.id, message.isRead)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {isUnread ? (
                      <Mail className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MailOpen className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {otherUser.name} ({otherUser.email})
                      </span>
                    </div>
                    <p className={`text-sm ${isUnread ? 'font-medium text-gray-900' : 'text-gray-600'} mt-1`}>
                      {message.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(message.createdAt)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMessage(message.id)
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                <div className="mt-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Konu:</strong> {message.subject}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>{type === 'inbox' ? 'Gönderen' : 'Alıcı'}:</strong> {otherUser.name} ({otherUser.email})
                    </div>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap text-gray-900">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 