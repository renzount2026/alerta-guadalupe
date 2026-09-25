import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GUADALUPE_CENTER, DEFAULT_ZOOM, QUADRANTS } from '../data/quadrants';
import { AlertTriangle, Shield, Eye, MapPin, User, Phone } from 'lucide-react';

// Custom DivIcons for Alerts
const createAlertIcon = (alertType) => {
  let bgColor = '#1E88E5';
  let borderColor = '#60A5FA';
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  let isPulse = false;

  if (alertType === 'Emergencia') {
    bgColor = '#DC2626';
    borderColor = '#FCA5A5';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    isPulse = true;
  } else if (alertType === 'Actitud Sospechosa') {
    bgColor = '#D97706';
    borderColor = '#FDE68A';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-alert-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isPulse ? '<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(220,38,38,0.4); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
        <div style="width: 34px; height: 34px; border-radius: 50%; background: ${bgColor}; border: 2px solid ${borderColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 10;">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
};

// Map controller to focus on selected alert or quadrant
function MapController({ selectedAlert, selectedQuadrant }) {
  const map = useMap();

  useEffect(() => {
    if (selectedAlert?.location) {
      map.flyTo([selectedAlert.location.lat, selectedAlert.location.lng], 17, {
        duration: 1.2
      });
    }
  }, [selectedAlert, map]);

  useEffect(() => {
    if (selectedQuadrant) {
      const q = QUADRANTS.find(item => item.id === selectedQuadrant);
      if (q) {
        map.flyTo(q.center, 16, { duration: 1.2 });
      }
    }
  }, [selectedQuadrant, map]);

  return null;
}

export default function MapView({
  alerts,
  selectedAlert,
  onSelectAlert,
  selectedQuadrant,
  onSelectQuadrant
}) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={GUADALUPE_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapController selectedAlert={selectedAlert} selectedQuadrant={selectedQuadrant} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contribs'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 12 Cuadrantes Tácticos de Guadalupe */}
        {QUADRANTS.map((quadrant) => {
          const isSelected = selectedQuadrant === quadrant.id;
          return (
            <Polygon
              key={quadrant.id}
              positions={quadrant.bounds}
              pathOptions={{
                color: isSelected ? '#38BDF8' : quadrant.color,
                fillColor: quadrant.color,
                fillOpacity: isSelected ? 0.35 : 0.15,
                weight: isSelected ? 3 : 1.5,
                dashArray: isSelected ? '4, 4' : undefined
              }}
              eventHandlers={{
                click: () => onSelectQuadrant(isSelected ? null : quadrant.id)
              }}
            >
              <Tooltip sticky direction="center" className="quadrant-tooltip">
                <div className="font-bold text-xs">{quadrant.id}: {quadrant.name}</div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Marcadores de Alertas en Tiempo Real */}
        {alerts.map((alert) => {
          const isSelected = selectedAlert?.id === alert.id;
          return (
            <Marker
              key={alert.id}
              position={[alert.location.lat, alert.location.lng]}
              icon={createAlertIcon(alert.alertType)}
              eventHandlers={{
                click: () => onSelectAlert(alert)
              }}
            >
              <Popup>
                <div className="text-slate-100 p-1 min-w-[240px]">
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-navy-700">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{alert.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      alert.alertType === 'Emergencia' ? 'bg-red-950 text-red-300 border border-red-800' :
                      alert.alertType === 'Actitud Sospechosa' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {alert.alertType}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{alert.subType}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-2">{alert.description}</p>

                  <div className="bg-navy-950/80 p-2 rounded-lg border border-navy-800 text-[11px] space-y-1 mb-2">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>{alert.citizen.fullName} (DNI: {alert.citizen.dni})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="truncate">{alert.location.addressReference}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectAlert(alert)}
                    className="w-full py-1.5 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs text-center transition"
                  >
                    Ver Ficha Completa
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
