import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  AlertTriangle, 
  FileCode, 
  ExternalLink,
  Video,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

export default function AlertDetailModal({ alert, onClose, onCenterOnMap }) {
  const [showJson, setShowJson] = useState(false);

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-navy-900 border border-navy-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-navy-700 flex items-center justify-between bg-navy-850">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${
              alert.alertType === 'Emergencia' ? 'bg-rose-500 animate-ping' :
              alert.alertType === 'Actitud Sospechosa' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Detalle de Incidencia: {alert.id}</h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  alert.alertType === 'Emergencia' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  alert.alertType === 'Actitud Sospechosa' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {alert.alertType}
                </span>
              </div>
              <p className="text-xs text-slate-400">Estado actual: <strong className="text-emerald-400">{alert.status}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-2.5 py-1 text-xs rounded-lg bg-navy-950 hover:bg-navy-800 border border-navy-700 text-slate-300 flex items-center gap-1.5 transition"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              {showJson ? 'Ver Ficha' : 'Ver JSON'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {showJson ? (
            <div className="space-y-2">
              <span className="text-xs text-slate-400">Estructura exacta del Payload JSON recibido:</span>
              <pre className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                {JSON.stringify(alert, null, 2)}
              </pre>
            </div>
          ) : (
            <>
              {/* Citizen Card */}
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-750">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-400" />
                  Datos del Ciudadano (Registro Obligatorio)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">DNI</span>
                    <strong className="text-white font-mono text-sm">{alert.citizen.dni}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nombre Completo</span>
                    <strong className="text-white">{alert.citizen.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Edad</span>
                    <strong className="text-white">{alert.citizen.age} años</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Teléfono Móvil</span>
                    <a
                      href={`tel:${alert.citizen.phone}`}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3 h-3" />
                      {alert.citizen.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Subtype and Description */}
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Categoría / Subtipo:
                  </span>
                  <span className="text-xs font-bold text-white px-2.5 py-0.5 rounded bg-blue-600/30 border border-blue-500/40">
                    {alert.subType}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Descripción del suceso reportado:</span>
                  <p className="text-sm text-slate-100 bg-navy-950 p-3 rounded-lg border border-navy-800 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>

              {/* Location & Time */}
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-750">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Geolocalización GPS al emitir alerta
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">{alert.location.addressReference}</span>
                    <a
                      href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                    >
                      Abrir en Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Coordenadas: lat: {alert.location.lat} • lng: {alert.location.lng}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Fecha de registro: {new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Media Viewer Section */}
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-750">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  {alert.mediaType === 'VIDEO' ? (
                    <Video className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                  )}
                  Evidencia Adjunta (100% Opcional)
                </h4>

                {alert.mediaUrl ? (
                  alert.mediaType === 'VIDEO' ? (
                    <div className="rounded-xl overflow-hidden bg-black border border-navy-700">
                      <video
                        src={alert.mediaUrl}
                        controls
                        className="w-full max-h-72 object-contain"
                      >
                        Tu navegador no soporta video HTML5.
                      </video>
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden bg-navy-950 border border-navy-700 flex items-center justify-center p-2">
                      <img
                        src={alert.mediaUrl}
                        alt="Evidencia fotográfica"
                        className="max-h-72 object-contain rounded-lg"
                      />
                    </div>
                  )
                ) : (
                  <div className="p-4 rounded-lg bg-navy-950/60 border border-navy-800 text-center text-xs text-slate-400">
                    El ciudadano no adjuntó archivo multimedia. El reporte fue emitido únicamente con texto y geolocalización.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-navy-700 bg-navy-850 flex items-center justify-between">
          <button
            onClick={() => {
              onCenterOnMap(alert);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            Enfocar en Mapa
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
