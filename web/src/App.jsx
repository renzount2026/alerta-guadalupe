import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import AlertList from './components/AlertList';
import MapView from './components/MapView';
import AlertDetailModal from './components/AlertDetailModal';
import SimulatorModal from './components/SimulatorModal';
import { Send, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { supabase, isSupabaseConfigured, formatAlertFromDb } from './lib/supabase';

// If VITE_API_URL is set, use it; otherwise use relative path /api (works identically in Vercel and local proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionMode, setConnectionMode] = useState('Conectando...');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bannerAlert, setBannerAlert] = useState(null);
  const pollIntervalRef = useRef(null);

  // Play alert audio chime
  const playAlertSound = (isEmergency) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = isEmergency ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isEmergency ? 880 : 587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio context error", e);
    }
  };

  // Fetch alerts from API
  const fetchAlertsFromApi = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setAlerts(json.data);
          setIsConnected(true);
          setConnectionMode(json.source === 'supabase' ? 'Supabase Cloud DB' : 'Vercel Serverless');
        }
      }
    } catch (e) {
      console.warn("Could not connect to API server yet:", e);
    }
  };

  useEffect(() => {
    // 1. SUPABASE REALTIME MODE (Recommended Cloud Architecture)
    if (isSupabaseConfigured && supabase) {
      setConnectionMode('Supabase Realtime');

      // Fetch initial alerts snapshot from Supabase
      supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
        .then(({ data, error }) => {
          if (!error && data) {
            setAlerts(data.map(formatAlertFromDb));
            setIsConnected(true);
          } else {
            console.warn('Supabase query error, fallback to API:', error?.message);
            fetchAlertsFromApi();
          }
        });

      // Subscribe to real-time database changes
      const channel = supabase
        .channel('realtime:alerts')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'alerts' },
          (payload) => {
            const newAlert = formatAlertFromDb(payload.new);
            setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id)]);
            setBannerAlert(newAlert);
            playAlertSound(newAlert.alertType === 'Emergencia');
            setTimeout(() => setBannerAlert(null), 6000);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'alerts' },
          (payload) => {
            const updated = formatAlertFromDb(payload.new);
            setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setConnectionMode('Supabase Realtime');
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsConnected(false);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // 2. SERVERLESS / SSE / POLLING FALLBACK MODE
    fetchAlertsFromApi();

    let eventSource;
    try {
      eventSource = new EventSource(`${API_BASE_URL}/api/alerts/stream`);

      eventSource.onopen = () => {
        setIsConnected(true);
        setConnectionMode('Vercel Cloud SSE');
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'INIT_ALERTS') {
            setAlerts(parsed.payload);
          } else if (parsed.type === 'NEW_ALERT') {
            const newAlert = parsed.payload;
            setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id)]);
            setBannerAlert(newAlert);
            playAlertSound(newAlert.alertType === 'Emergencia');
            setTimeout(() => setBannerAlert(null), 6000);
          }
        } catch (err) {
          console.error("Error parsing SSE data", err);
        }
      };

      eventSource.onerror = () => {
        // In serverless environments, SSE might close; fallback to polling
        setIsConnected(true);
        setConnectionMode('Cloud API (Polling)');
      };
    } catch (e) {
      console.warn("SSE connection error", e);
    }

    // Polling backup every 10 seconds for resilient cloud updates
    pollIntervalRef.current = setInterval(() => {
      fetchAlertsFromApi();
    }, 10000);

    return () => {
      if (eventSource) eventSource.close();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [soundEnabled]);

  // Handle send from simulator
  const handleSendAlert = async (alertPayload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPayload)
      });
      if (res.ok) {
        const json = await res.json();
        const finalAlert = json.data || alertPayload;
        setAlerts(prev => [finalAlert, ...prev.filter(a => a.id !== finalAlert.id)]);
        setBannerAlert(finalAlert);
        playAlertSound(finalAlert.alertType === 'Emergencia');
        setTimeout(() => setBannerAlert(null), 6000);
      } else {
        // Fallback local update if server error
        setAlerts(prev => [alertPayload, ...prev.filter(a => a.id !== alertPayload.id)]);
        setBannerAlert(alertPayload);
        playAlertSound(alertPayload.alertType === 'Emergencia');
        setTimeout(() => setBannerAlert(null), 6000);
      }
    } catch (e) {
      console.warn('Network send error, applying local optimistic update:', e);
      setAlerts(prev => [alertPayload, ...prev.filter(a => a.id !== alertPayload.id)]);
      setBannerAlert(alertPayload);
      playAlertSound(alertPayload.alertType === 'Emergencia');
      setTimeout(() => setBannerAlert(null), 6000);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-navy-950 select-none">
      {/* Top Header */}
      <Header
        alertsCount={alerts.length}
        isConnected={isConnected}
        connectionMode={connectionMode}
        onRefresh={isSupabaseConfigured && supabase ? () => {
          supabase
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)
            .then(({ data }) => {
              if (data) setAlerts(data.map(formatAlertFromDb));
            });
        } : fetchAlertsFromApi}
      />

      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Side: Alert Feed and Quadrant Filter */}
        <AlertList
          alerts={alerts}
          selectedAlert={selectedAlert}
          onSelectAlert={(a) => setSelectedAlert(a)}
          selectedQuadrant={selectedQuadrant}
          onSelectQuadrant={(q) => setSelectedQuadrant(q)}
        />

        {/* Right Side: Leaflet Interactive Map */}
        <div className="flex-1 relative h-full">
          <MapView
            alerts={alerts}
            selectedAlert={selectedAlert}
            onSelectAlert={(a) => setSelectedAlert(a)}
            selectedQuadrant={selectedQuadrant}
            onSelectQuadrant={(q) => setSelectedQuadrant(q)}
          />

          {/* Floating Controls on Map */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Silenciar alarmas" : "Activar alarmas"}
              className={`p-2.5 rounded-xl border transition shadow-lg ${
                soundEnabled 
                  ? 'bg-navy-900/90 text-cyan-400 border-navy-700 hover:bg-navy-800' 
                  : 'bg-navy-900/90 text-slate-500 border-navy-700 hover:bg-navy-800'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <Send className="w-4 h-4" />
              Simular Reporte Móvil
            </button>
          </div>

          {/* Incoming Alert Alert Banner */}
          {bannerAlert && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-30 animate-bounce">
              <div
                onClick={() => setSelectedAlert(bannerAlert)}
                className={`p-4 rounded-2xl shadow-2xl cursor-pointer border flex items-start gap-3 backdrop-blur-md ${
                  bannerAlert.alertType === 'Emergencia'
                    ? 'bg-rose-950/90 border-rose-600 text-rose-100'
                    : bannerAlert.alertType === 'Actitud Sospechosa'
                    ? 'bg-amber-950/90 border-amber-600 text-amber-100'
                    : 'bg-blue-950/90 border-blue-600 text-blue-100'
                }`}
              >
                <ShieldAlert className="w-6 h-6 shrink-0 text-white" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="font-bold text-sm">¡NUEVA ALERTA RECIBIDA!</strong>
                    <span className="font-mono text-[10px]">{bannerAlert.id}</span>
                  </div>
                  <p className="font-semibold text-white">{bannerAlert.subType}</p>
                  <p className="text-[11px] opacity-90 truncate">{bannerAlert.description}</p>
                  <p className="text-[10px] opacity-75 mt-1">Por: {bannerAlert.citizen.fullName} ({bannerAlert.location.addressReference})</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detalle de Incidencia */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onCenterOnMap={(alert) => setSelectedAlert(alert)}
        />
      )}

      {/* Modal de Simulación para Pruebas */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSendAlert={handleSendAlert}
      />
    </div>
  );
}
