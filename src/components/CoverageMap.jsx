// components/CoverageMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Book icon for libraries
const bookIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2237/2237701.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Delivery truck icon
const truckIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097140.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const CoverageMap = () => {
  const [mounted, setMounted] = useState(false);

  // Mock data for service coverage areas
  const serviceCities = [
    { 
      id: 1, 
      name: 'Dhaka', 
      position: [23.8103, 90.4125],
      libraries: 12,
      type: 'main',
      description: 'Central hub with 12 partner libraries'
    },
    { 
      id: 2, 
      name: 'Chittagong', 
      position: [22.3569, 91.7832],
      libraries: 8,
      type: 'major',
      description: 'Port city with 8 partner libraries'
    },
    { 
      id: 3, 
      name: 'Rajshahi', 
      position: [24.3745, 88.6042],
      libraries: 6,
      type: 'major',
      description: 'Educational hub with 6 libraries'
    },
    { 
      id: 4, 
      name: 'Khulna', 
      position: [22.8456, 89.5403],
      libraries: 5,
      type: 'regional',
      description: 'Southern region service center'
    },
    { 
      id: 5, 
      name: 'Sylhet', 
      position: [24.8949, 91.8687],
      libraries: 4,
      type: 'regional',
      description: 'Northeastern service area'
    },
    { 
      id: 6, 
      name: 'Barishal', 
      position: [22.7029, 90.3466],
      libraries: 3,
      type: 'regional',
      description: 'Riverine area coverage'
    },
    { 
      id: 7, 
      name: 'Rangpur', 
      position: [25.7439, 89.2752],
      libraries: 4,
      type: 'regional',
      description: 'Northern region service'
    },
    { 
      id: 8, 
      name: 'Mymensingh', 
      position: [24.7471, 90.4203],
      libraries: 3,
      type: 'expanding',
      description: 'Newly added service area'
    }
  ];

  // Delivery centers (warehouses)
  const deliveryCenters = [
    { id: 1, name: 'Dhaka Central Hub', position: [23.8103, 90.4125], vehicles: 25 },
    { id: 2, name: 'Chittagong Logistics', position: [22.3569, 91.7832], vehicles: 15 },
    { id: 3, name: 'Rajshahi Depot', position: [24.3745, 88.6042], vehicles: 10 }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default center and zoom for Bangladesh
  const center = [23.6850, 90.3563]; // Center of Bangladesh
  const zoom = 7;

  if (!mounted) {
    return (
      <div className="h-64 bg-base-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-2 text-muted">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Our Service Coverage</h2>
        <p className="text-muted">
          We deliver books to 8 major cities across Bangladesh with 45+ partner libraries.
          Click on markers to see details.
        </p>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm">Main Service Area</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm">Major City</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-sm">Regional Center</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/2237/2237701.png" alt="Library" className="w-4 h-4" />
          <span className="text-sm">Partner Library</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/3097/3097140.png" alt="Delivery" className="w-4 h-4" />
          <span className="text-sm">Delivery Center</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-base-300 shadow-inner">
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-96 w-full z-0"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Service Coverage Circles */}
          {serviceCities.map(city => {
            let color = 'blue';
            let radius = 30000; // 30km in meters
            
            if (city.type === 'main') {
              color = 'blue';
              radius = 50000;
            } else if (city.type === 'major') {
              color = 'green';
              radius = 40000;
            } else if (city.type === 'regional') {
              color = 'yellow';
              radius = 30000;
            } else {
              color = 'orange';
              radius = 20000;
            }
            
            return (
              <Circle
                key={`circle-${city.id}`}
                center={city.position}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  color: color,
                  weight: 1,
                  opacity: 0.2,
                  fillOpacity: 0.1
                }}
              />
            );
          })}

          {/* City Markers (Libraries) */}
          {serviceCities.map(city => (
            <Marker
              key={`city-${city.id}`}
              position={city.position}
              icon={bookIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{city.name}</h3>
                  <p className="text-sm text-muted">{city.description}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Partner Libraries:</span>
                      <span className="badge badge-primary">{city.libraries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Service Type:</span>
                      <span className="badge badge-outline capitalize">{city.type}</span>
                    </div>
                    <div className="mt-2 text-xs">
                      📍 Lat: {city.position[0].toFixed(4)}, Lng: {city.position[1].toFixed(4)}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Delivery Centers */}
          {deliveryCenters.map(center => (
            <Marker
              key={`center-${center.id}`}
              position={center.position}
              icon={truckIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">🚚 {center.name}</h3>
                  <p className="text-sm">Delivery and logistics hub</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Delivery Vehicles:</span>
                      <span className="badge badge-secondary">{center.vehicles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="badge badge-success">Active</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Map Attribution */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
          © OpenStreetMap contributors
        </div>
      </div>

      {/* Stats and Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <span className="text-2xl">🏙️</span>
            </div>
            <div className="stat-title">Cities Covered</div>
            <div className="stat-value">{serviceCities.length}</div>
            <div className="stat-desc">Across Bangladesh</div>
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <span className="text-2xl">📚</span>
            </div>
            <div className="stat-title">Partner Libraries</div>
            <div className="stat-value">{serviceCities.reduce((sum, city) => sum + city.libraries, 0)}+</div>
            <div className="stat-desc">Nationwide network</div>
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <span className="text-2xl">🚚</span>
            </div>
            <div className="stat-title">Delivery Centers</div>
            <div className="stat-value">{deliveryCenters.length}</div>
            <div className="stat-desc">Logistics hubs</div>
          </div>
        </div>
      </div>

      {/* Expansion Plan */}
      <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h3 className="font-bold text-lg mb-2">🚀 Expansion Plans</h3>
        <div className="flex flex-wrap gap-3">
          <div className="badge badge-outline">Cox's Bazar - Coming Q2 2024</div>
          <div className="badge badge-outline">Comilla - Coming Q3 2024</div>
          <div className="badge badge-outline">Jessore - Coming Q4 2024</div>
          <div className="badge badge-outline">Dinajpur - Planning Stage</div>
        </div>
        <p className="text-sm text-muted mt-2">
          We're constantly expanding to serve more readers across Bangladesh.
        </p>
      </div>
    </div>
  );
};

export default CoverageMap;