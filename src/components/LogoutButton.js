import { LogOut } from 'lucide-react'
import { logoutAction } from '@/lib/actions'

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
      >
        <LogOut className="h-4 w-4" />
        <span>Çıkış</span>
      </button>
    </form>
  )
} 