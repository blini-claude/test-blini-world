import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import './VisitorGlobe.css'

const SEED_VISITORS = [
  { lat: 40.7128,  lng: -74.0060,  label: 'New York' },
  { lat: 51.5074,  lng: -0.1278,   label: 'London' },
  { lat: 35.6762,  lng: 139.6503,  label: 'Tokyo' },
  { lat: 48.8566,  lng: 2.3522,    label: 'Paris' },
  { lat: -33.8688, lng: 151.2093,  label: 'Sydney' },
  { lat: 55.7558,  lng: 37.6173,   label: 'Moscow' },
  { lat: 19.0760,  lng: 72.8777,   label: 'Mumbai' },
  { lat: -23.5505, lng: -46.6333,  label: 'São Paulo' },
  { lat: 1.3521,   lng: 103.8198,  label: 'Singapore' },
  { lat: 25.2048,  lng: 55.2708,   label: 'Dubai' },
  { lat: 37.7749,  lng: -122.4194, label: 'San Francisco' },
  { lat: 52.5200,  lng: 13.4050,   label: 'Berlin' },
  { lat: 39.9042,  lng: 116.4074,  label: 'Beijing' },
  { lat: 37.5665,  lng: 126.9780,  label: 'Seoul' },
  { lat: -34.6037, lng: -58.3816,  label: 'Buenos Aires' },
  { lat: 6.5244,   lng: 3.3792,    label: 'Lagos' },
  { lat: 30.0444,  lng: 31.2357,   label: 'Cairo' },
  { lat: 28.6139,  lng: 77.2090,   label: 'New Delhi' },
  { lat: 43.6532,  lng: -79.3832,  label: 'Toronto' },
  { lat: 41.9028,  lng: 12.4964,   label: 'Rome' },
  { lat: 59.9139,  lng: 10.7522,   label: 'Oslo' },
  { lat: 34.0522,  lng: -118.2437, label: 'Los Angeles' },
  { lat: -1.2921,  lng: 36.8219,   label: 'Nairobi' },
  { lat: 13.7563,  lng: 100.5018,  label: 'Bangkok' },
]

export default function VisitorGlobe() {
  const globeEl = useRef()
  const containerRef = useRef()
  const [points, setPoints] = useState(SEED_VISITORS)
  const [rings, setRings] = useState([])
  const [globeSize, setGlobeSize] = useState(500)
  const [myLocation, setMyLocation] = useState(null)

  // Fetch current visitor's geolocation
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          const me = {
            lat: data.latitude,
            lng: data.longitude,
            label: `You — ${data.city || data.country_name || 'Here'}`,
            isMe: true,
          }
          setMyLocation(me)
          setPoints(prev => [me, ...prev])
          // Animate camera to visitor
          setTimeout(() => {
            globeEl.current?.pointOfView(
              { lat: data.latitude, lng: data.longitude, altitude: 1.8 },
              1800
            )
          }, 600)
        }
      })
      .catch(() => {})
  }, [])

  // Auto-rotate
  useEffect(() => {
    const ctrl = globeEl.current?.controls()
    if (ctrl) {
      ctrl.autoRotate = true
      ctrl.autoRotateSpeed = 0.5
      ctrl.enableZoom = false
    }
  }, [])

  // Pulse rings on random points every 1.2s
  useEffect(() => {
    if (!points.length) return
    const id = setInterval(() => {
      const p = points[Math.floor(Math.random() * points.length)]
      setRings(prev => [
        ...prev.slice(-8),
        { ...p, id: Math.random(), maxR: 4, propagationSpeed: 2.5, repeatPeriod: 800 },
      ])
    }, 1200)
    return () => clearInterval(id)
  }, [points])

  // Responsive width
  useEffect(() => {
    const obs = new ResizeObserver(() => {
      if (containerRef.current) {
        setGlobeSize(containerRef.current.offsetWidth)
      }
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="globe-section">
      <h2 className="globe-title">Visitors around the world</h2>

      <div ref={containerRef} className="globe-wrap">
        <Globe
          ref={globeEl}
          width={globeSize}
          height={globeSize}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.18}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointLabel="label"
          pointColor={d => d.isMe ? '#ff4444' : '#60a5fa'}
          pointAltitude={0.01}
          pointRadius={d => d.isMe ? 0.55 : 0.3}
          ringsData={rings}
          ringLat="lat"
          ringLng="lng"
          ringColor={d => d.isMe ? '#ff444488' : '#3b82f688'}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
        />
      </div>

      <div className="globe-legend">
        <span><span className="dot red" /> You</span>
        <span><span className="dot blue" /> Visitors</span>
      </div>

      {myLocation && (
        <p className="globe-you">
          Your location: <strong>{myLocation.label.replace('You — ', '')}</strong>
        </p>
      )}
    </section>
  )
}
