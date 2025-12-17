// components/CoverageMap.jsx
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Book Icon
const createBookIcon = () => L.divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #0ea5a4, #6366f1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(14, 165, 164, 0.3);
      border: 2px solid white;
    ">
      <svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 24 24">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"/>
      </svg>
    </div>
  `,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Custom Truck Icon
const createTruckIcon = () => L.divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #f59e0b, #f97316);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      border: 2px solid white;
    ">
      <svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 24 24">
        <path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM19.5 9.5H17V12h4.46l-1.96-2.5zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4h3z"/>
      </svg>
    </div>
  `,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const CoverageMap = () => {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef(null);

  // Service coverage data
  const serviceCities = [
    { 
      id: 1, 
      name: 'Dhaka', 
      position: [23.8103, 90.4125],
      libraries: 12,
      type: 'main',
      color: '#3B82F6', // Blue
      description: 'Central hub with 12 partner libraries including University of Dhaka Library and National Library',
      deliveryTime: 'Same day',
      population: '21+ million'
    },
    { 
      id: 2, 
      name: 'Chittagong', 
      position: [22.3569, 91.7832],
      libraries: 8,
      type: 'major',
      color: '#10B981', // Green
      description: 'Port city with 8 partner libraries including Chittagong University Library',
      deliveryTime: '1-2 days',
      population: '5+ million'
    },
    { 
      id: 3, 
      name: 'Rajshahi', 
      position: [24.3745, 88.6042],
      libraries: 6,
      type: 'major',
      color: '#10B981',
      description: 'Educational hub with 6 libraries including Rajshahi University Library',
      deliveryTime: '1-2 days',
      population: '1+ million'
    },
    { 
      id: 4, 
      name: 'Khulna', 
      position: [22.8456, 89.5403],
      libraries: 5,
      type: 'regional',
      color: '#F59E0B', // Yellow
      description: 'Southern region service center with 5 partner libraries',
      deliveryTime: '2-3 days',
      population: '1.5+ million'
    },
    { 
      id: 5, 
      name: 'Sylhet', 
      position: [24.8949, 91.8687],
      libraries: 4,
      type: 'regional',
      color: '#F59E0B',
      description: 'Northeastern service area with 4 partner libraries',
      deliveryTime: '2-3 days',
      population: '1+ million'
    },
    { 
      id: 6, 
      name: 'Barishal', 
      position: [22.7029, 90.3466],
      libraries: 3,
      type: 'regional',
      color: '#F59E0B',
      description: 'Riverine area coverage with 3 partner libraries',
      deliveryTime: '2-3 days',
      population: '0.5+ million'
    },
    { 
      id: 7, 
      name: 'Rangpur', 
      position: [25.7439, 89.2752],
      libraries: 4,
      type: 'regional',
      color: '#F59E0B',
      description: 'Northern region service with 4 partner libraries',
      deliveryTime: '2-3 days',
      population: '0.8+ million'
    },
    { 
      id: 8, 
      name: 'Mymensingh', 
      position: [24.7471, 90.4203],
      libraries: 3,
      type: 'expanding',
      color: '#EF4444', // Red
      description: 'Newly added service area with 3 partner libraries',
      deliveryTime: '3-4 days',
      population: '0.5+ million'
    }
  ];

  // Delivery centers
  const deliveryCenters = [
    { 
      id: 1, 
      name: 'Dhaka Central Hub', 
      position: [23.8103, 90.4125], 
      vehicles: 25,
      capacity: '5000+ books daily'
    },
    { 
      id: 2, 
      name: 'Chittagong Logistics', 
      position: [22.3569, 91.7832], 
      vehicles: 15,
      capacity: '2000+ books daily'
    },
    { 
      id: 3, 
      name: 'Rajshahi Depot', 
      position: [24.3745, 88.6042], 
      vehicles: 10,
      capacity: '1000+ books daily'
    }
  ];

  // Expansion plans
  const expansionCities = [
    { name: "Cox's Bazar", position: [21.4272, 92.0058], eta: 'Q2 2024' },
    { name: 'Comilla', position: [23.4619, 91.1850], eta: 'Q3 2024' },
    { name: 'Jessore', position: [23.1697, 89.2137], eta: 'Q4 2024' },
    { name: 'Dinajpur', position: [25.6279, 88.6332], eta: '2025' }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Fix Leaflet default icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Center of Bangladesh
  const center = [23.6850, 90.3563];
  const zoom = 7;

  const getRadius = (type) => {
    switch(type) {
      case 'main': return 50000; // 50km
      case 'major': return 40000; // 40km
      case 'regional': return 30000; // 30km
      default: return 20000; // 20km
    }
  };

  const handleCityClick = (city) => {
    if (mapRef.current) {
      mapRef.current.flyTo(city.position, 11, {
        duration: 1.5
      });
    }
  };

  if (!mounted) {
    return (
      <div className="h-96 bg-base-200 rounded-xl flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-muted font-medium">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
          📍 Service Coverage Map
        </h2>
        <p className="text-muted max-w-3xl mx-auto">
          Explore our network of {serviceCities.reduce((sum, city) => sum + city.libraries, 0)}+ partner libraries 
          across {serviceCities.length} cities in Bangladesh. Click on markers for details.
        </p>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 justify-center mb-6 p-4 bg-base-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium">Main Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">Major City</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-sm font-medium">Regional Center</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm font-medium">Expanding</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-xs">📚</span>
          </div>
          <span className="text-sm font-medium">Library Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white text-xs">🚚</span>
          </div>
          <span className="text-sm font-medium">Delivery Center</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative rounded-xl overflow-hidden border-4 border-base-300 shadow-2xl mb-8">
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-[500px] w-full"
          scrollWheelZoom={true}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Service Coverage Circles */}
          {serviceCities.map(city => (
            <Circle
              key={`circle-${city.id}`}
              center={city.position}
              radius={getRadius(city.type)}
              pathOptions={{
                fillColor: city.color,
                color: city.color,
                weight: 2,
                opacity: 0.3,
                fillOpacity: 0.1
              }}
            />
          ))}

          {/* City Markers */}
          {serviceCities.map(city => (
            <Marker
              key={`city-${city.id}`}
              position={city.position}
              icon={createBookIcon()}
              eventHandlers={{
                click: () => handleCityClick(city),
              }}
            >
              <Popup>
                <div className="p-3 min-w-[280px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: city.color + '20' }}>
                      <span className="text-xl">📚</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{city.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-sm" style={{ backgroundColor: city.color, border: 'none', color: 'white' }}>
                          {city.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-muted">{city.population}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{city.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-base-200 p-2 rounded">
                      <div className="text-xs text-muted">Libraries</div>
                      <div className="font-bold text-lg">{city.libraries}</div>
                    </div>
                    <div className="bg-base-200 p-2 rounded">
                      <div className="text-xs text-muted">Delivery</div>
                      <div className="font-bold text-lg">{city.deliveryTime}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleCityClick(city)}
                    className="btn btn-sm btn-primary w-full mt-3"
                  >
                    View Area
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Delivery Centers */}
          {deliveryCenters.map(center => (
            <Marker
              key={`center-${center.id}`}
              position={center.position}
              icon={createTruckIcon()}
            >
              <Popup>
                <div className="p-3 min-w-[250px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-white text-xl">🚚</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{center.name}</h3>
                      <span className="badge badge-success badge-sm">ACTIVE</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Vehicles:</span>
                      <span className="font-bold">{center.vehicles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Daily Capacity:</span>
                      <span className="font-bold">{center.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">Status:</span>
                      <span className="badge badge-success badge-sm">Operational</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <div className="bg-base-100 p-3 rounded-lg shadow-lg">
            <h4 className="font-bold text-sm mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button 
                onClick={() => mapRef.current?.flyTo(center, zoom)}
                className="btn btn-xs btn-outline w-full"
              >
                Reset View
              </button>
              <button 
                onClick={() => mapRef.current?.setZoom(mapRef.current?.getZoom() + 1)}
                className="btn btn-xs btn-outline w-full"
              >
                Zoom In
              </button>
              <button 
                onClick={() => mapRef.current?.setZoom(mapRef.current?.getZoom() - 1)}
                className="btn btn-xs btn-outline w-full"
              >
                Zoom Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* City Quick Select */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Quick Select Cities</h3>
        <div className="flex flex-wrap gap-3">
          {serviceCities.map(city => (
            <button
              key={city.id}
              onClick={() => handleCityClick(city)}
              className="btn btn-outline gap-2"
              style={{ borderColor: city.color, color: city.color }}
            >
              <span>{city.name}</span>
              <span className="badge" style={{ backgroundColor: city.color, color: 'white' }}>
                {city.libraries}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="stat">
            <div className="stat-figure text-primary">
              <span className="text-3xl">🏙️</span>
            </div>
            <div className="stat-title">Cities Covered</div>
            <div className="stat-value text-primary">{serviceCities.length}</div>
            <div className="stat-desc">Across Bangladesh</div>
          </div>
        </div>
        
        <div className="stats shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <span className="text-3xl">📚</span>
            </div>
            <div className="stat-title">Partner Libraries</div>
            <div className="stat-value text-secondary">
              {serviceCities.reduce((sum, city) => sum + city.libraries, 0)}+
            </div>
            <div className="stat-desc">Nationwide network</div>
          </div>
        </div>
        
        <div className="stats shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="stat">
            <div className="stat-figure text-accent">
              <span className="text-3xl">🚚</span>
            </div>
            <div className="stat-title">Delivery Centers</div>
            <div className="stat-value text-accent">{deliveryCenters.length}</div>
            <div className="stat-desc">Logistics hubs</div>
          </div>
        </div>
        
        <div className="stats shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="stat">
            <div className="stat-figure text-purple-500">
              <span className="text-3xl">⚡</span>
            </div>
            <div className="stat-title">Avg Delivery</div>
            <div className="stat-value text-purple-500">1-2 Days</div>
            <div className="stat-desc">Fast service</div>
          </div>
        </div>
      </div>

      {/* Expansion Plans */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-2xl text-white">🚀</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Expansion Plans 2024-2025</h3>
            <p className="text-muted">We're constantly growing to serve more readers</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {expansionCities.map((city, index) => (
            <div key={index} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title text-lg">{city.name}</h4>
                <div className="badge badge-outline">{city.eta}</div>
                <p className="text-sm text-muted mt-2">New service area coming soon</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="loading loading-spinner loading-xs text-primary"></span>
                  <span className="text-xs">In planning phase</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Instructions */}
      <div className="mt-6 text-center text-sm text-muted">
        <p>
          💡 <strong>Tip:</strong> Click on any marker for details. Use mouse wheel to zoom, drag to pan.
          Cities with larger circles have wider coverage areas.
        </p>
      </div>
    </div>
  );
};

export default CoverageMap;