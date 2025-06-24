'use client'

import { useState } from 'react'

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackText = 'Resim Yok',
  errorText = 'Resim Yüklenemedi',
  ...props 
}) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Eğer src yoksa veya hata varsa fallback göster
  if (!src || imageError) {
    const displayText = !src ? fallbackText : errorText
    const isEmoji = /^\p{Emoji}+$/u.test(displayText)
    
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 ${className}`} {...props}>
        <span className={isEmoji ? "text-8xl" : "text-gray-100 text-sm"}>
          {displayText}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      onLoad={() => setImageLoaded(true)}
      {...props}
    />
  )
} 