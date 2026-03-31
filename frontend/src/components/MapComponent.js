import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const MapComponent = ({ routeData }) => {
    if (!routeData || !routeData.polyline || routeData.polyline.length === 0) {
        return <div className="surface-card text-slate-300">Loading map...</div>;
    }

    const startPosition = routeData.polyline[0];
    const endPosition = routeData.polyline[routeData.polyline.length - 1];

    return (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/20 shadow-xl shadow-slate-950/20">
            <MapContainer center={startPosition} zoom={7} style={{ height: '400px', width: '100%' }} className="z-10">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <Marker position={startPosition}>
                    <Popup>Starting Point</Popup>
                </Marker>

                <Marker position={endPosition}>
                    <Popup>Final Destination</Popup>
                </Marker>

                <Polyline pathOptions={{ color: '#f97316', weight: 5, opacity: 0.85 }} positions={routeData.polyline} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
