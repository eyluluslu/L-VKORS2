'use client'

import { useState } from 'react'
import { createTeamMember, updateTeamMember, deleteTeamMember } from '../lib/team-actions'

export default function TeamForm({ initialMembers = [] }) {
  const [members, setMembers] = useState(initialMembers)
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    description: '',
    imageUrl: '',
    emoji: '👤',
    isActive: true
  })
  const [editingMember, setEditingMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      Object.keys(newMember).forEach(key => {
        if (key === 'isActive') {
          formData.append(key, newMember[key] ? 'on' : '')
        } else {
          formData.append(key, newMember[key])
        }
      })

      const result = await createTeamMember(formData)
      
      if (result.success) {
        showMessage('success', result.message)
        setNewMember({
          name: '',
          position: '',
          description: '',
          imageUrl: '',
          emoji: '👤',
          isActive: true
        })
        // Refresh page to show new member
        window.location.reload()
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'Bir hata oluştu')
    }

    setLoading(false)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      Object.keys(editingMember).forEach(key => {
        if (key === 'isActive') {
          formData.append(key, editingMember[key] ? 'on' : '')
        } else if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          formData.append(key, editingMember[key] || '')
        }
      })

      const result = await updateTeamMember(editingMember.id, formData)
      
      if (result.success) {
        showMessage('success', result.message)
        setEditingMember(null)
        window.location.reload()
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'Bir hata oluştu')
    }

    setLoading(false)
  }

  const handleDelete = async (memberId) => {
    if (!confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) {
      return
    }

    setLoading(true)

    try {
      const result = await deleteTeamMember(memberId)
      
      if (result.success) {
        showMessage('success', result.message)
        setMembers(members.filter(m => m.id !== memberId))
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'Bir hata oluştu')
    }

    setLoading(false)
  }

  const emojiOptions = [
    '👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', 
    '👨‍🔧', '👩‍🔧', '👨‍⚕️', '👩‍⚕️', '👨‍🏫', '👩‍🏫',
    '👨‍🎤', '👩‍🎤', '👨‍🚀', '👩‍🚀', '🧑‍💼', '🧑‍💻'
  ]

  return (
    <div className="space-y-8">
      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add New Member Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Yeni Ekip Üyesi Ekle
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İsim *
              </label>
              <input
                type="text"
                required
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pozisyon *
              </label>
              <input
                type="text"
                required
                value={newMember.position}
                onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={newMember.description}
              onChange={(e) => setNewMember({...newMember, description: e.target.value})}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotoğraf URL'si
              </label>
              <input
                type="url"
                value={newMember.imageUrl}
                onChange={(e) => setNewMember({...newMember, imageUrl: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emoji
              </label>
              <select
                value={newMember.emoji}
                onChange={(e) => setNewMember({...newMember, emoji: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {emojiOptions.map(emoji => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newMember.isActive}
                onChange={(e) => setNewMember({...newMember, isActive: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Ekip Üyesi Ekle'}
          </button>
        </form>
      </div>

      {/* Existing Members */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mevcut Ekip Üyeleri ({members.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className="border border-gray-200 rounded-lg p-4">
              <div className="text-center mb-3">
                {member.imageUrl ? (
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">{member.emoji}</span>
                  </div>
                )}
              </div>
              
              <h4 className="font-semibold text-center text-gray-900">{member.name}</h4>
              <p className="text-sm text-blue-600 text-center">{member.position}</p>
              {member.description && (
                <p className="text-xs text-gray-600 mt-2 text-center">{member.description}</p>
              )}
              
              <div className="flex items-center justify-center space-x-2 mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  member.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {member.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="flex justify-center space-x-2 mt-3">
                <button
                  onClick={() => handleEdit(member)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Henüz ekip üyesi eklenmemiş.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ekip Üyesini Düzenle
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İsim *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pozisyon *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.position}
                  onChange={(e) => setEditingMember({...editingMember, position: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={editingMember.description || ''}
                  onChange={(e) => setEditingMember({...editingMember, description: e.target.value})}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotoğraf URL'si
                </label>
                <input
                  type="url"
                  value={editingMember.imageUrl || ''}
                  onChange={(e) => setEditingMember({...editingMember, imageUrl: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emoji
                </label>
                <select
                  value={editingMember.emoji}
                  onChange={(e) => setEditingMember({...editingMember, emoji: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {emojiOptions.map(emoji => (
                    <option key={emoji} value={emoji}>{emoji}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingMember.isActive}
                    onChange={(e) => setEditingMember({...editingMember, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Aktif</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 