import React, { useState } from 'react';
import { QUADRANTS } from '../data/quadrants';
import { Send, X, AlertCircle } from 'lucide-react';

export default function SimulatorModal({ isOpen, onClose, onSendAlert }) {
  const [alertType, setAlertType] = useState('Alerta Seguridad');
  const [subType, setSubType] = useState('Asalto mano armada');
  const [description, setDescription] = useState('');
  const [selectedQuadrantId, setSelectedQuadrantId] = useState('C-01');
  const [dni, setDni] = useState('72345678');
  const [fullName, setFullName] = useState('Carlos Mendoza Ruiz');
  const [age, setAge] = useState('28');
  const [phone, setPhone] = useState('+51 978 654 321');
  const [mediaType, setMediaType] = useState('IMAGE');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = QUADRANTS.find(item => item.id === selectedQuadrantId) || QUADRANTS[0];
    
    // Slight offset around quadrant center
    const lat = q.center[0] + (Math.random() - 0.5) * 0.003;
    const lng = q.center[1] + (Math.random() - 0.5) * 0.003;

    const newAlert = {
      id: `RPT-2026-${Math.floor(100 + Math.random() * 900)}`,
      citizen: {
        dni,
        fullName,
        age: parseInt(age) || 28,
        phone
      },
      alertType,
      subType: alertType === 'Alerta Seguridad' ? subType : alertType === 'Actitud Sospechosa' ? 'Actitud Sospechosa' : 'Emergencia Inmediata',
      description: description || `Incidencia reportada en cuadrante ${q.id} (${q.name}).`,
      location: {
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        addressReference: `${q.name}, ${q.id} Guadalupe`
      },
      mediaUrl: mediaType === 'IMAGE' 
        ? "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"
        : mediaType === 'VIDEO'
        ? "https://www.w3schools.com/html/mov_bbb.mp4"
        : null,
      mediaType: mediaType || null,
      createdAt: new Date().toISOString(),
      status: "REGISTRADO"
    };

    onSendAlert(newAlert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-navy-900 border border-navy-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-700 pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">Simular Envío desde Móvil Android</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Tipo de Alerta</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full p-2 bg-navy-950 border border-navy-700 rounded-lg text-white"
              >
                <option value="Alerta Seguridad">Alerta Seguridad</option>
                <option value="Actitud Sospechosa">Actitud Sospechosa</option>
                <option value="Emergencia">Emergencia</option>
              </select>
            </div>

            {alertType === 'Alerta Seguridad' && (
              <div>
                <label className="text-slate-400 block mb-1">Subtipo / Delito</label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className="w-full p-2 bg-navy-950 border border-navy-700 rounded-lg text-white"
                >
                  <option value="Asalto mano armada">Asalto mano armada</option>
                  <option value="Gresca">Gresca</option>
                  <option value="Robo">Robo</option>
                  <option value="Vandalismo">Vandalismo</option>
                  <option value="Otras faltas">Otras faltas</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Cuadrante en Guadalupe (Malla C-01 a C-12)</label>
            <select
              value={selectedQuadrantId}
              onChange={(e) => setSelectedQuadrantId(e.target.value)}
              className="w-full p-2 bg-navy-950 border border-navy-700 rounded-lg text-white"
            >
              {QUADRANTS.map(q => (
                <option key={q.id} value={q.id}>{q.id}: {q.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Descripción del Incidente</label>
            <textarea
              rows={2}
              placeholder="Descripción del hecho..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-navy-950 border border-navy-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">DNI Ciudadano</label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full p-2 bg-navy-950 border border-navy-700 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Nombre Ciudadano</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 bg-navy-950 border border-navy-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Adjunto Multimedia (Opcional)</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="w-full p-2 bg-navy-950 border border-navy-700 rounded-lg text-white"
            >
              <option value="IMAGE">Foto de Evidencia (JPG)</option>
              <option value="VIDEO">Video Corto (MP4)</option>
              <option value="">Sin Adjunto (Solo Texto + GPS)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-navy-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-navy-800 text-slate-300 hover:bg-navy-750"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Disparar Alerta al Servidor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
