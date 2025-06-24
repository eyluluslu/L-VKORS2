'use client'

import { useState, useActionState } from 'react'
import { User, Lock } from 'lucide-react'
import { loginAction } from '@/lib/actions'

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <>
      {state?.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email adresi
          </label>
          <div className="mt-1 relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="email@example.com"
            />
            <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Şifre
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Şifrenizi girin"
            />
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </div>
      </form>
    </>
  )
} 