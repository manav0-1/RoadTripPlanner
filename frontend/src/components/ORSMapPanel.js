import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';

const collectBounds = ({ smartRoutes, nearbyCenter, nearbyPlaces, fitnessRoute, isochrones }) => {
  const points = [];

  smartRoutes.forEach((route) => {
    (route.polyline || []).forEach((point) => points.push(point));
  });

  if (fitnessRoute?.polyline) {
    fitnessRoute.polyline.forEach((point) => points.push(point));
  }

  if (nearbyCenter) {
    points.push(nearbyCenter);
  }

  nearbyPlaces.forEach((place) => {
    if (place.coordinates) {
      points.push(place.coordinates);
    }
  });

  isochrones.forEach((polygon) => {
    (polygon.coordinates || []).forEach((ring) => {
      ring.forEach((point) => points.push(point));
    });
  });

  return points;
};

const FitToData = ({ points }) => {
  const map = useMap();

  React.useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }

    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [map, points]);

  return null;
};

const ORSMapPanel = ({ smartRoutes = [], nearbyCenter = null, nearbyPlaces = [], fitnessRoute = null, isochrones = [] }) => {
  const points = useMemo(
    () => collectBounds({ smartRoutes, nearbyCenter, nearbyPlaces, fitnessRoute, isochrones }),
    [smartRoutes, nearbyCenter, nearbyPlaces, fitnessRoute, isochrones]
  );

  return (
    <div className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-black/20 shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '560px', width: '100%' }} className="z-10">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FitToData points={points} />

        {smartRoutes.map((route) => (
          <Polyline
            key={`${route.routeType}-${route.profile}`}
            positions={route.polyline}
            pathOptions={{ color: route.routeType === 'fastest' ? '#6df7c1' : '#c782ff', weight: 5, opacity: 0.9 }}
          />
        ))}

        {fitnessRoute?.polyline && (
          <Polyline positions={fitnessRoute.polyline} pathOptions={{ color: '#63c7ff', weight: 5, opacity: 0.95 }} />
        )}

        {isochrones.map((polygon) => (
          <Polygon
            key={`iso-${polygon.minutes}`}
            positions={polygon.coordinates}
            pathOptions={{ color: '#84ffd8', weight: 2, fillColor: '#84ffd8', fillOpacity: 0.08 }}
          >
            <Popup>{polygon.minutes} minute reach zone</Popup>
          </Polygon>
        ))}

        {nearbyCenter && (
          <Marker position={nearbyCenter}>
            <Popup>Your current area</Popup>
          </Marker>
        )}

        {nearbyPlaces.map((place) => (
          <Marker key={place.id} position={place.coordinates}>
            <Popup>
              <div>
                <p className="font-semibold">{place.name}</p>
                <p>{place.category}</p>
                <p>{place.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ORSMapPanel;
