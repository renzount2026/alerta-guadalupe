import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import AlertList from './components/AlertList';
import MapView from './components/MapView';
import AlertDetailModal from './components/AlertDetailModal';
import SimulatorModal from './components/SimulatorModal';
import { Send, Volume2, VolumeX, ShieldAlert, BellRing } from 'lucide-react';
import { supabase, isSupabaseConfigured, formatAlertFromDb } from './lib/supabase';

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
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // References to track known alert IDs to detect and announce new incoming reports
  const knownAlertIdsRef = useRef(new Set());
  const isFirstLoadRef = useRef(true);
  const audioCtxRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Ensure AudioContext is initialized and unlocked by user interaction
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play distinctive synthesized siren/chime according to alert priority
  const playAlertSound = (alertType) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const isEmergency = alertType === 'Emergencia';
      const isSuspicious = alertType === 'Actitud Sospechosa';

      if (isEmergency) {
        // High-low dual urgency siren
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        
        // Alternating pitch siren
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(659, now + 0.3);
        osc.frequency.linearRampToValueAtTime(987, now + 0.6);
        osc.frequency.linearRampToValueAtTime(587, now + 0.9);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (isSuspicious) {
        // Warning chime
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.4);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } else {
        // Standard security notification chime (two-tone)
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.setValueAtTime(880, now + 0.25); // A5

        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.7);
      }
      setAudioUnlocked(true);
    } catch (e) {
      console.warn("Audio playback exception:", e);
    }
  };

  // Test sound triggered by user click (guarantees browser audio unlock)
  const handleTestSound = () => {
    getAudioContext();
    playAlertSound('Emergencia');
  };

  // Process incoming alerts array, detecting brand new alerts to trigger alarms
  const handleAlertsFeed = (incomingAlerts) => {
    if (!Array.isArray(incomingAlerts)) return;

    if (isFirstLoadRef.current) {
      // First snapshot load: populate without false sirens
      incomingAlerts.forEach(a => knownAlertIdsRef.current.add(a.id));
      isFirstLoadRef.current = false;
      setAlerts(incomingAlerts);
      return;
    }

    // Check for newly received alerts
    const brandNewAlerts = incomingAlerts.filter(a => !knownAlertIdsRef.current.has(a.id));

    if (brandNewAlerts.length > 0) {
      const mostRecent = brandNewAlerts[0];
      // Trigger sound and visual banner
      playAlertSound(mostRecent.alertType);
      setBannerAlert(mostRecent);
      setSelectedAlert(mostRecent);

      // Auto-dismiss banner after 8 seconds
      setTimeout(() => {
        setBannerAlert(null);
      }, 8000);

      // Register all new IDs
      brandNewAlerts.forEach(a => knownAlertIdsRef.current.add(a.id));
    }

    setAlerts(incomingAlerts);
  };

  // Fetch alerts from API
  const fetchAlertsFromApi = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts?_t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          handleAlertsFeed(json.data);
          setIsConnected(true);
          setConnectionMode(json.source === 'supabase' ? 'Supabase Cloud DB' : 'Vercel Serverless');
        }
      }
    } catch (e) {
      console.warn("Error connecting to API server:", e);
    }
  };

  useEffect(() => {
    // Unlock AudioContext on first user interaction in document
    const unlockListener = () => {
      getAudioContext();
      window.removeEventListener('click', unlockListener);
      window.removeEventListener('keydown', unlockListener);
    };
    window.addEventListener('click', unlockListener);
    window.addEventListener('keydown', unlockListener);

    // 1. SUPABASE REALTIME MODE (if configured)
    if (isSupabaseConfigured && supabase) {
      setConnectionMode('Supabase Realtime');

      supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
        .then(({ data, error }) => {
          if (!error && data) {
            handleAlertsFeed(data.map(formatAlertFromDb));
            setIsConnected(true);
          } else {
            fetchAlertsFromApi();
          }
        });

      const channel = supabase
        .channel('realtime:alerts')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'alerts' },
          (payload) => {
            const newAlert = formatAlertFromDb(payload.new);
            handleAlertsFeed([newAlert, ...alerts]);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setConnectionMode('Supabase Realtime');
          }
        });

      return () => {
        supabase.removeChannel(channel);
        window.removeEventListener('click', unlockListener);
        window.removeEventListener('keydown', unlockListener);
      };
    }

    // 2. SERVERLESS POLLING & SSE MODE (Fast 4-second poll loop)
    fetchAlertsFromApi();

    pollIntervalRef.current = setInterval(() => {
      fetchAlertsFromApi();
    }, 4000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      window.removeEventListener('click', unlockListener);
      window.removeEventListener('keydown', unlockListener);
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
        knownAlertIdsRef.current.add(finalAlert.id);
        setAlerts(prev => [finalAlert, ...prev.filter(a => a.id !== finalAlert.id)]);
        setBannerAlert(finalAlert);
        playAlertSound(finalAlert.alertType);
        setTimeout(() => setBannerAlert(null), 8000);
      }
    } catch (e) {
      console.warn('Network send error, applying local update:', e);
      setAlerts(prev => [alertPayload, ...prev.filter(a => a.id !== alertPayload.id)]);
      setBannerAlert(alertPayload);
      playAlertSound(alertPayload.alertType);
      setTimeout(() => setBannerAlert(null), 8000);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-navy-950 select-none">
      {/* Top Header */}
      <Header
        alertsCount={alerts.length}
        isConnected={isConnected}
        connectionMode={connectionMode}
        onRefresh={fetchAlertsFromApi}
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
            {/* Audio Test / State Button */}
            <button
              onClick={handleTestSound}
              title="Probar sonido de alarma (habilita audio del navegador)"
              className="px-3 py-2.5 rounded-xl bg-navy-900/95 border border-cyan-500/40 hover:bg-navy-800 text-cyan-400 font-semibold text-xs flex items-center gap-1.5 shadow-lg transition"
            >
              <BellRing className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Probar Alarma</span>
            </button>

            <button
              onClick={() => {
                getAudioContext();
                setSoundEnabled(!soundEnabled);
              }}
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
                    ? 'bg-rose-950/95 border-rose-600 text-rose-100 ring-2 ring-rose-500'
                    : bannerAlert.alertType === 'Actitud Sospechosa'
                    ? 'bg-amber-950/95 border-amber-600 text-amber-100 ring-2 ring-amber-500'
                    : 'bg-blue-950/95 border-blue-600 text-blue-100 ring-2 ring-blue-500'
                }`}
              >
                <ShieldAlert className="w-6 h-6 shrink-0 text-white animate-pulse" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="font-bold text-sm">¡NUEVA ALERTA RECIBIDA!</strong>
                    <span className="font-mono text-[10px]">{bannerAlert.id}</span>
                  </div>
                  <p className="font-semibold text-white text-sm">{bannerAlert.subType}</p>
                  <p className="text-[11px] opacity-90 truncate">{bannerAlert.description}</p>
                  <p className="text-[10px] opacity-80 mt-1">
                    Por: <strong>{bannerAlert.citizen.fullName}</strong> ({bannerAlert.location.addressReference})
                  </p>
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
