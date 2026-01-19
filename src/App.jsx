import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      <div className="container">
        <h1>Photo Gallery</h1>
        <div className="loading">Loading photos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <h1>Photo Gallery</h1>
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Photo Gallery</h1>
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img 
              src={photo.url} 
              alt={photo.title || `Photo ${photo.id}`}
              className="photo-thumbnail"
              loading="lazy"
            />
            <div className="photo-title">{photo.title || 'Untitled'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
