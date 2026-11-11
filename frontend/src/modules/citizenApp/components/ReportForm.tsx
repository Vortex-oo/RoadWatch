import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Small component to let the user click the map to move the pin
const LocationMarker = ({ position, setPosition }: any) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

export const ReportForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [position, setPosition] = useState<any>(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  // Auto-fetch GPS on component load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("GPS Denied, using default"),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Photo Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-black">1. Take a photo of the damage</label>
        <div className="sketch w-full h-40 bg-[#e9ecef] border-dashed flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-200">
          <span className="text-xl text-gray-600">Tap to open camera</span>
          {/* Hidden file input stretching over the box */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setHasPhoto(!!e.target.files?.length)}
          />
        </div>
        
        {/* Mock AI Check Result - only shows if photo is "uploaded" */}
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
            <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
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

      {/* 3. Description Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-black">3. Describe it (Optional)</label>
        <textarea 
          rows={3} 
          className="sketch w-full p-4 text-xl outline-none focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform"
          placeholder="E.g., Very deep, causes cars to swerve..."
        ></textarea>
      </div>

      {/* Submit Action */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="sketch w-full py-4 mt-4 bg-[#ffec99] text-2xl font-bold text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        Submit Report
      </button>
    </div>
  );
};