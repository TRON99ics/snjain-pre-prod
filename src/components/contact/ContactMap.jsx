import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { regions } from '../../data/site';
import 'leaflet/dist/leaflet.css';

const HUB = regions[0];
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const hubIcon = L.divIcon({
  className: 'trade-marker-icon',
  html: `
    <div class="trade-marker trade-marker--hub trade-marker--active" aria-hidden="true">
      <span class="trade-marker__ring"></span>
      <span class="trade-marker__dot"></span>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function ContactMap() {
  const center = useMemo(() => [HUB.lat, HUB.lng], []);

  return (
    <div className="trade-map relative z-0 isolate h-[min(420px,55vh)] w-full overflow-hidden bg-ink sm:h-[420px]">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl
      >
        <TileLayer url={DARK_TILES} attribution={TILE_ATTRIBUTION} />
        <Marker position={center} icon={hubIcon} />
      </MapContainer>
    </div>
  );
}
