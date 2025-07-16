"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/css/map.css';

// Updated data for Delhi electricity power plants
const powerPlants = [
  { id: 1, name: 'Indraprastha Power Station', lat: 28.6139, lng: 77.2490, capacity: 270, status: 'operational', type: 'Thermal' },
  { id: 2, name: 'Rajghat Power House', lat: 28.6511, lng: 77.2507, capacity: 135, status: 'retired', type: 'Thermal' },
  { id: 3, name: 'Pragati Power Station', lat: 28.6127, lng: 77.2773, capacity: 1371.2, status: 'operational', type: 'Gas-Based' },
  { id: 4, name: 'Badarpur Thermal Power Station', lat: 28.5021, lng: 77.3016, capacity: 705, status: 'retired', type: 'Thermal' },
  { id: 5, name: 'Timarpur-Okhla Waste to Energy Plant', lat: 28.5615, lng: 77.2717, capacity: 23, status: 'operational', type: 'Waste-to-Energy' },
  { id: 6, name: 'Bawana Power Plant', lat: 28.7969, lng: 77.0428, capacity: 1500, status: 'operational', type: 'Gas-Based' },
  { id: 7, name: 'Rithala Power Plant', lat: 28.7329, lng: 77.1025, capacity: 108, status: 'operational', type: 'Gas-Based' },
  { id: 8, name: 'Ghazipur Waste-to-Energy Plant', lat: 28.6275, lng: 77.3289, capacity: 12, status: 'operational', type: 'Waste-to-Energy' },
  { id: 9, name: 'Okhla Waste-to-Energy Plant', lat: 28.5437, lng: 77.2730, capacity: 16, status: 'operational', type: 'Waste-to-Energy' },
  { id: 10, name: 'Badarpur Waste-to-Energy Plant', lat: 28.5073, lng: 77.3017, capacity: 24, status: 'operational', type: 'Waste-to-Energy' },
  { id: 11, name: 'NDMC Solar Power Project', lat: 28.6129, lng: 77.2295, capacity: 5, status: 'operational', type: 'Solar' },
];

const DelhiPowerMap = () => {
  const [selectedStatus, setSelectedStatus] = useState('operational');
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setMapKey(prevKey => prevKey + 1);
  }, [selectedStatus]);

  const filteredPlants = powerPlants.filter(plant => plant.status === selectedStatus);

  const totalCapacity = powerPlants.reduce((sum, plant) => sum + plant.capacity, 0);
  const operationalCapacity = powerPlants.filter(plant => plant.status === 'operational').reduce((sum, plant) => sum + plant.capacity, 0);

  const getMarkerIcon = (type) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${getColor(type)}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
               <span style="color: white; font-weight: bold; font-size: 16px;">${getInitial(type)}</span>
             </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const getColor = (type) => {
    switch (type) {
      case 'Thermal': return '#FF5733';
      case 'Gas-Based': return '#33FF57';
      case 'Waste-to-Energy': return '#3357FF';
      case 'Solar': return '#FFFF33';
      default: return '#808080';
    }
  };

  const getInitial = (type) => {
    switch (type) {
      case 'Thermal': return 'T';
      case 'Gas-Based': return 'G';
      case 'Waste-to-Energy': return 'W';
      case 'Solar': return 'S';
      default: return 'O';
    }
  };

  return (
    <section className="relative max-container padding-container py-20">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Delhi Electricity Power Map</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Total Installed Capacity</h3>
            <p className="text-4xl font-bold text-blue-600">{totalCapacity.toFixed(2)} MW</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Operational Capacity</h3>
            <p className="text-4xl font-bold text-green-600">{operationalCapacity.toFixed(2)} MW</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Filter by Status</h3>
            <div className="space-y-2">
              {['operational', 'pipeline', 'retired'].map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={() => setSelectedStatus(status)}
                    className="form-radio text-blue-600"
                  />
                  <span className="capitalize text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Legend</h3>
            <div className="space-y-2">
              {['Thermal', 'Gas-Based', 'Waste-to-Energy', 'Solar'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <div style={{
                    backgroundColor: getColor(type),
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{getInitial(type)}</span>
                  </div>
                  <span className="text-gray-700">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="bg-white p-2 rounded-lg shadow-lg" style={{ height: '600px' }}>
            <MapContainer
              key={mapKey}
              center={[28.6139, 77.2090]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {filteredPlants.map((plant) => (
                <Marker
                  key={plant.id}
                  position={[plant.lat, plant.lng]}
                  icon={getMarkerIcon(plant.type)}
                >
                  <Popup className="custom-popup">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">{plant.name}</h3>
                      <p className="text-sm"><span className="font-medium">Capacity:</span> {plant.capacity} MW</p>
                      <p className="text-sm"><span className="font-medium">Type:</span> {plant.type}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> <span className="capitalize">{plant.status}</span></p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DelhiPowerMap;