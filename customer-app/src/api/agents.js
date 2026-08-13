const mockAgents = [
  {
    id: 1,
    name: 'Bole Agent Kiosk',
    address: 'Bole Road, near Edna Mall',
    latitude: 8.9950,
    longitude: 38.7890,
    hours: 'Mon–Sat, 8am–6pm',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Piassa Cash Point',
    address: 'Piassa, near St. George Cathedral',
    latitude: 9.0350,
    longitude: 38.7480,
    hours: 'Mon–Sun, 7am–9pm',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Megenagna Express',
    address: 'Megenagna, near the roundabout',
    latitude: 9.0180,
    longitude: 38.7980,
    hours: 'Mon–Sat, 9am–7pm',
    rating: 4.8,
  },
]

export function getNearbyAgents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAgents)
    }, 800)
  })
}