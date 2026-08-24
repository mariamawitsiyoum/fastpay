import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import { getNearbyAgents } from '../api/agents'
import { calculateDistanceKm } from '../utils/distance'
import '../utils/leafletIconFix'
import Skeleton from '../components/Skeleton'

function RecenterMap({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14)
    }
  }, [position, map])

  return null
}

function AgentLocator() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [maxDistance, setMaxDistance] = useState('any')
  const [minRating, setMinRating] = useState('any')

  useEffect(() => {
    async function fetchAgents() {
      const data = await getNearbyAgents()
      setAgents(data)
      setLoading(false)
    }

    fetchAgents()
  }, [])

  function handleFindMyLocation() {
    setLocationError('')

    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location services')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        setLocationError('Could not get your location. Please allow location access.')
      }
    )
  }

//   if (loading) {
//     return <p className="text-slate-500">Loading nearby agents...</p>
//   }
        if (loading) {
        return (
            <div>
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-[400px] w-full mb-4" />
            <div className="flex flex-col gap-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
            </div>
        )
        }

  const userPosition = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : null

  const agentsWithDistance = agents.map((agent) => {
    const distanceKm = userLocation
      ? calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          agent.latitude,
          agent.longitude
        )
      : null

    return { ...agent, distanceKm }
  })

  const filteredAgents = agentsWithDistance.filter((agent) => {
    if (maxDistance !== 'any' && agent.distanceKm !== null) {
      if (agent.distanceKm > Number(maxDistance)) {
        return false
      }
    }

    if (minRating !== 'any') {
      if (agent.rating < Number(minRating)) {
        return false
      }
    }

    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Nearby Agents</h1>
        <button
          onClick={handleFindMyLocation}
          className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded px-3 py-2"
        >
          Use my location
        </button>
      </div>

      <div className="flex gap-3 mb-2">
        <select
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
          disabled={!userLocation}
          className="border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 disabled:opacity-50"
        >
          <option value="any">Any distance</option>
          <option value="1">Within 1 km</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="25">Within 25 km</option>
        </select>

        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm text-slate-700"
        >
          <option value="any">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>

      {!userLocation && (
        <p className="text-slate-500 text-sm mb-3">
          Tip: use "Use my location" to filter agents by distance.
        </p>
      )}

      {locationError && (
        <p className="text-red-600 text-sm mb-3">{locationError}</p>
      )}

      <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-4" style={{ height: '400px' }}>
        <MapContainer
          center={[9.005, 38.763]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <RecenterMap position={userPosition} />

          {userPosition && (
            <CircleMarker
              center={userPosition}
              radius={9}
              pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 1 }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}

          {filteredAgents.map((agent) => (
            <Marker key={agent.id} position={[agent.latitude, agent.longitude]}>
              <Popup>
                <strong>{agent.name}</strong>
                <br />
                {agent.address}
                <br />
                {agent.hours}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-col gap-3">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-white shadow-sm rounded-xl p-4">
            <h2 className="text-slate-800 font-semibold">{agent.name}</h2>
            <p className="text-slate-700 text-sm">{agent.address}</p>
            <p className="text-slate-500 text-sm mt-1">{agent.hours}</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-amber-600 text-sm">★ {agent.rating}</p>
              {agent.distanceKm !== null && (
                <p className="text-slate-500 text-sm">{agent.distanceKm.toFixed(1)} km away</p>
              )}
            </div>
          </div>
        ))}

        {filteredAgents.length === 0 && (
          <p className="text-slate-500 text-sm">No agents match your filters.</p>
        )}
      </div>
    </div>
  )
}

export default AgentLocator