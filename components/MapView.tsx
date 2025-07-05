'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// 아이콘 깨짐 방지 설정
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
})

interface MapViewProps {
  lat: number
  lng: number
}

export default function MapView({ lat, lng }: MapViewProps) {
    return (
        <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-64 rounded-lg z-0">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[lat, lng]}>
                <Popup>📍 대략 여기에 있어요!</Popup>
            </Marker>
        </MapContainer>
    )
}
