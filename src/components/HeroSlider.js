'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSlider({ banners }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState('next')
  const activeBanners = banners.filter(banner => banner.isActive)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return

    const interval = setInterval(() => {
      if (!isAnimating) {
        setSlideDirection('next')
        nextSlideWithAnimation()
      }
    }, 5000) // 5 saniyede bir değiş

    return () => clearInterval(interval)
  }, [activeBanners.length, isHovered, isAnimating])

  const nextSlideWithAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length)
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  const prevSlideWithAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setSlideDirection(index > currentSlide ? 'next' : 'prev')
    setCurrentSlide(index)
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  const nextSlide = () => {
    setSlideDirection('next')
    nextSlideWithAnimation()
  }

  const prevSlide = () => {
    setSlideDirection('prev')
    prevSlideWithAnimation()
  }

  // Touch/Swipe support
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  if (activeBanners.length === 0) {
    // Varsayılan banner
    return (
      <div className="relative h-[600px] bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent transform rotate-12 scale-150"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent transform -rotate-12 scale-150"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <div className="text-center text-white relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Özel Tasarım Çantalar</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md max-w-3xl mx-auto">Her tarza uygun kaliteli çantalar. Kadın, erkek ve özel koleksiyonlar.</p>
          <Link 
            href="/products" 
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ürünleri İncele
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="banner-container relative h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress Bar */}
      {activeBanners.length > 1 && !isHovered && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/20 z-50">
          <div 
            className="h-full bg-white/80 transition-all duration-300 ease-linear"
            style={{
              width: isAnimating ? '100%' : '0%',
              animation: !isAnimating ? 'progress 5s linear infinite' : 'none'
            }}
          />
        </div>
      )}

      {/* Banner Slides */}
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`banner-slide absolute inset-0 banner-fade transform transition-all duration-600 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 visible z-10 translate-x-0 scale-100' 
              : index < currentSlide
                ? 'opacity-0 invisible z-0 -translate-x-full scale-95'
                : 'opacity-0 invisible z-0 translate-x-full scale-95'
          }`}
        >
          {/* Background Image */}
          <div className="relative h-full w-full">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={90}
              onLoad={() => {
                // Image loaded successfully
                console.log('Banner image loaded:', banner.title)
              }}
              onError={() => {
                // Handle image load error
                console.error('Banner image failed to load:', banner.title)
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10"></div>
            {/* Additional Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50 z-20"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center text-white max-w-4xl px-4 relative">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <h2 className="text-2xl md:text-3xl mb-6 drop-shadow-xl">
                  {banner.subtitle}
                </h2>
              )}
              {banner.description && (
                <p className="text-lg md:text-xl mb-8 drop-shadow-lg max-w-3xl mx-auto opacity-90">
                  {banner.description}
                </p>
              )}

            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
              isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
              isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Enhanced Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-8 h-3 bg-white shadow-lg' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75 hover:scale-125'
              } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Slide ${index + 1}'e git`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {activeBanners.length > 1 && (
        <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentSlide + 1} / {activeBanners.length}
        </div>
      )}
    </div>
  )
} 