import { useState, useEffect } from 'react'

function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log('App rendered', { loading, error, photosCount: photos.length })

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('https://boringapi.com/api/v1/photos/')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.photos) {
          // Get first 20 photos
          setPhotos(data.photos.slice(0, 20))
        } else {
          throw new Error('Invalid data format received from API')
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching photos')
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8" style={{ minHeight: '100vh' }}>
        <h1 className="text-center mb-8 text-4xl font-semibold text-gray-800">Photo Gallery</h1>
        <div className="text-center py-8 text-xl text-blue-600">Loading photos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-center mb-8 text-4xl font-semibold text-gray-800">Photo Gallery</h1>
        <div className="text-center py-8 px-8 text-lg text-red-600 bg-red-50 rounded-lg border border-red-200">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 bg-gray-50" style={{ minHeight: '100vh' }}>
      <h1 className="text-center mb-8 text-4xl font-semibold text-gray-800">Photo Gallery</h1>
      {photos.length === 0 ? (
        <div className="text-center py-8 text-lg text-gray-600">No photos available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <img 
                src={photo.url} 
                alt={photo.title || `Photo ${photo.id}`}
                className="w-full h-48 object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="p-4 text-sm text-gray-700 leading-relaxed min-h-[3rem] flex items-center break-words">
                {photo.title || 'Untitled'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
