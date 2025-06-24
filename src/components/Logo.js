'use client'

import Link from 'next/link'

export default function Logo({ 
  logoUrl = null, 
  siteName = 'Livkors', 
  size = 'normal', 
  href = '/',
  className = '',
  showText = true 
}) {
  const sizeClasses = {
    small: {
      logo: 'h-6 w-6',
      emoji: 'text-xl',
      text: 'text-xl'
    },
    normal: {
      logo: 'h-8 w-8',
      emoji: 'text-2xl',
      text: 'text-2xl'
    },
    large: {
      logo: 'h-12 w-12',
      emoji: 'text-6xl',
      text: 'text-3xl'
    }
  }

  const currentSize = sizeClasses[size] || sizeClasses.normal

  const LogoContent = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={siteName} 
          className={`${currentSize.logo} rounded-full object-cover`}
        />
      ) : (
        <img 
          src="/logo.jpg" 
          alt={siteName} 
          className={`${currentSize.logo} rounded-full object-cover`}
        />
      )}
      {showText && (
        <span className={`${currentSize.text} font-bold text-yellow-500`}>
          {siteName}
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
} 