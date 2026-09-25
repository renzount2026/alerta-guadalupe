import React, { useState } from 'react';
import { QUADRANTS } from '../data/quadrants';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Video, 
  Image as ImageIcon, 
  Clock, 
  MapPin, 
  User, 
  Layers
} from 'lucide-react';

export default function AlertList({
  alerts,
  selectedAlert,
  onSelectAlert,
  selectedQuadrant,
  onSelectQuadrant
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredAlerts = alerts.filter(alert => {
    // Type filter
    if (typeFilter !== 'ALL' && alert.alertType !== typeFilter) {
      return false;
    }
    // Quadrant filter
    if (selectedQuadrant) {
      const q = QUADRANTS.find(item => item.id === selectedQuadrant);
      if (q && !alert.location.addressReference?.includes(q.id) && !alert.description?.includes(q.id)) {
        // Coordinate bounding check
        const { lat, lng } = alert.location;
        const lats = q.bounds.map(p => p[0]);
        const lngs = q.bounds.map(p => p[1]);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const inBounds = lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
        if (!inBounds) return false;
      }
    }
    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchDni = alert.citizen?.dni?.toLowerCase().includes(term);
      const matchName = alert.citizen?.fullName?.toLowerCase().includes(term);
      const matchDesc = alert.description?.toLowerCase().includes(term);
      const matchSub = alert.subType?.toLowerCase().includes(term);
      return matchDni || matchName || matchDesc || matchSub;
    }
    return true;
  });

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const minutesAgo = Math.floor((Date.now() - date.getTime()) / 60000);
      if (minutesAgo < 1) return 'Hace un momento';
      if (minutesAgo < 60) return `Hace ${minutesAgo} min`;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="w-96 h-full bg-navy-900 border-r border-navy-700 flex flex-col z-20 shadow-xl">
      {/* Search & Header */}
      <div className="p-4 border-b border-navy-700 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por DNI, nombre o suceso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-navy-950 border border-navy-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Quadrant Selector */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <select
            value={selectedQuadrant || ''}
            onChange={(e) => onSelectQuadrant(e.target.value || null)}
            className="w-full bg-navy-950 border border-navy-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">Todos los Cuadrantes (12 Cuadrantes)</option>
            {QUADRANTS.map(q => (
              <option key={q.id} value={q.id}>
                {q.id}: {q.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition ${
              typeFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-navy-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({alerts.length})
          </button>
          <button
            onClick={() => setTypeFilter('Alerta Seguridad')}
            className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition ${
              typeFilter === 'Alerta Seguridad'
                ? 'bg-blue-700 text-white'
                : 'bg-navy-800 text-slate-400 hover:text-blue-300'
            }`}
          >
            Seguridad
          </button>
          <button
            onClick={() => setTypeFilter('Actitud Sospechosa')}
            className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition ${
              typeFilter === 'Actitud Sospechosa'
                ? 'bg-amber-600 text-white'
                : 'bg-navy-800 text-slate-400 hover:text-amber-300'
            }`}
          >
            Sospechosa
          </button>
          <button
            onClick={() => setTypeFilter('Emergencia')}
            className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition ${
              typeFilter === 'Emergencia'
                ? 'bg-rose-600 text-white'
                : 'bg-navy-800 text-slate-400 hover:text-rose-300'
            }`}
          >
            Emergencia
          </button>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No se encontraron alertas en este cuadrante o filtro.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isSelected = selectedAlert?.id === alert.id;
            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className={`p-3 rounded-xl cursor-pointer transition border ${
                  isSelected
                    ? 'bg-navy-800 border-blue-500 shadow-lg'
                    : 'bg-navy-850/80 border-navy-700/80 hover:border-slate-600 hover:bg-navy-800'
                }`}
              >
                {/* Header Card */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {alert.alertType === 'Emergencia' ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    ) : alert.alertType === 'Actitud Sospechosa' ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">{alert.id}</span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    alert.alertType === 'Emergencia' ? 'bg-red-950/80 text-rose-300 border border-rose-800/60' :
                    alert.alertType === 'Actitud Sospechosa' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' :
                    'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                  }`}>
                    {alert.alertType}
                  </span>
                </div>

                {/* SubType & Description */}
                <h4 className="text-xs font-bold text-white mb-1">{alert.subType}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                  {alert.description}
                </p>

                {/* Citizen & Location Preview */}
                <div className="pt-2 border-t border-navy-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[170px]">
                    <User className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">{alert.citizen.fullName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.mediaType === 'VIDEO' && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Video className="w-3 h-3" />
                        Video
                      </span>
                    )}
                    {alert.mediaType === 'IMAGE' && (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <ImageIcon className="w-3 h-3" />
                        Foto
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(alert.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
