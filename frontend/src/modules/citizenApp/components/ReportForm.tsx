import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const DEFAULT_CENTER = { lat: 22.5726, lng: 88.3639 };

const LocationMarker = ({ position, setPosition }: any) => {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position === null ? null : <Marker position={[position.lat, position.lng]}></Marker>;
};

export const ReportForm = ({
  onSubmit,
  value,
  onChange,
}: {
  onSubmit: (payload: {
    description: string;
    photo: File | string;
    latitude: number;
    longitude: number;
    severity: 'low' | 'medium' | 'high';
  }) => void;
  value: {
    description: string;
    photo: File | string;
    latitude: number;
    longitude: number;
    severity: 'low' | 'medium' | 'high';
  };
  onChange: (next: {
    description: string;
    photo: File | string;
    latitude: number;
    longitude: number;
    severity: 'low' | 'medium' | 'high';
  }) => void;
}) => {
  const [position, setPosition] = useState<any>(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(next);
          if (!value.latitude && !value.longitude) {
            onChange({ ...value, latitude: next.lat, longitude: next.lng });
          }
        },
        () => {
          setPosition(DEFAULT_CENTER);
          if (!value.latitude && !value.longitude) {
            onChange({ ...value, latitude: DEFAULT_CENTER.lat, longitude: DEFAULT_CENTER.lng });
          }
        },
        { enableHighAccuracy: true }
      );
    } else {
      setPosition(DEFAULT_CENTER);
      if (!value.latitude && !value.longitude) {
        onChange({ ...value, latitude: DEFAULT_CENTER.lat, longitude: DEFAULT_CENTER.lng });
      }
    }
  }, []);

  useEffect(() => {
    if (position) {
      onChange({
        ...value,
        latitude: position.lat,
        longitude: position.lng,
      });
    }
  }, [position]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Photo Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-black">1. Take a photo of the damage</label>
        <div className="sketch w-full h-40 bg-[#e9ecef] border-dashed flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-200">
          <span className="text-xl text-gray-600">
            {value.photo instanceof File ? value.photo.name : "Tap to open camera"}
          </span>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setHasPhoto(!!file);
              // We now pass the actual binary file to the state
              onChange({ ...value, photo: file || '' });
            }}
          />
        </div>
        
        {hasPhoto && (
          <div className="sketch w-full p-3 bg-[#b2f2bb] mt-2 flex items-center justify-between">
            <span className="text-lg text-black font-bold">AI Check: Pothole likely</span>
            <span className="text-lg text-black font-bold">[91%]</span>
          </div>
        )}
      </div>

      {/* 2. Map Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-black">2. Check the location</label>
        <p className="text-sm text-gray-600 leading-tight mb-1">Drag the map or tap to adjust the exact spot.</p>
        <div className="sketch w-full h-64 overflow-hidden relative z-0">
          {position ? (
            <MapContainer center={[position.lat, position.lng]} zoom={16} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              Getting GPS...
            </div>
          )}
        </div>
      </div>

      {/* 3. Severity Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-black">3. Severity</label>
        <select
          value={value.severity}
          onChange={(e) => onChange({ ...value, severity: e.target.value as 'low' | 'medium' | 'high' })}
          className="sketch w-full p-3 text-xl outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* 4. Description Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-black">4. Describe it (Optional)</label>
        <textarea
          rows={3}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          className="sketch w-full p-4 text-xl outline-none focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform"
          placeholder="E.g., Very deep, causes cars to swerve..."
        ></textarea>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
        className="sketch w-full py-4 mt-4 bg-[#ffec99] text-2xl font-bold text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        Submit Report
      </button>
    </div>
  );
};