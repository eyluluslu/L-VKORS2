'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Hata!</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Bir şeyler yanlış gitti
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || 'Beklenmeyen bir hata oluştu.'}
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors mr-4"
          >
            Tekrar Dene
          </button>
          
          <a
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
} 