import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Sample Data for Cleaned Locations
const cleanedLocations = [
  { id: 1, name: 'Market Street', lat: 12.9716, lng: 77.5946, cleanedDate: '2025-03-20' },
  { id: 2, name: 'Central Park', lat: 12.9352, lng: 77.6245, cleanedDate: '2025-03-18' },
  { id: 3, name: 'Community Hall', lat: 12.9105, lng: 77.5858, cleanedDate: '2025-03-15' },
];

function CleanedMap() {
  return (
    <div className="h-[500px] w-full relative z-0">
      <h1 className="text-2xl font-bold mb-4">Cleaned Locations</h1>
      <MapContainer center={[12.9716, 77.5946]} zoom={13} className="h-full w-full">
        {/* Map Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Markers for Cleaned Locations */}
        {cleanedLocations.map((location) => (
          <Marker key={location.id} position={[location.lat, location.lng]}>
            <Popup>
              <h3>{location.name}</h3>
              <p>Cleaned on: {location.cleanedDate}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CleanedMap;
