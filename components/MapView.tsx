'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { FaMapPin } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
    lat: number
    lng: number
}

// react-icons의 FaMapPin을 HTML로 변환해서 커스텀 마커로 사용
const customMarkerHtml = renderToStaticMarkup(
    <FaMapPin
        style={{
            width: '30px',
            height: '30px',
            fill: '#ef4444',         // 내부 채우기
            stroke: '#000',          // 외곽선
            strokeWidth: '25px',
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.25))',
        }}
    />
)

const customIcon = new L.DivIcon({
    html: customMarkerHtml,
    className: '', // 기본 leaflet-div-icon 클래스 제거
    iconSize: [28, 28],
    iconAnchor: [14, 28], // 마커 하단이 기준점
})

export default function MapView({ lat, lng }: MapViewProps) {
    return (
        <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-102 w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={customIcon}>
                <Popup>📍 위치 근처입니다!</Popup>
            </Marker>
        </MapContainer>
    )
}
