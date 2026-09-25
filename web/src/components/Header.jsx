import React, { useState, useEffect } from 'react';
import { Shield, Radio, Activity, RefreshCw, Cloud, Zap } from 'lucide-react';

export default function Header({ alertsCount, isConnected, connectionMode = 'Cloud API', onRefresh }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-navy-900 border-b border-navy-700 px-6 flex items-center justify-between z-30 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-100 tracking-wide">
              CENTRAL C4 • REPORTE CIUDADANO Y SEGURIDAD VECINAL
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 border border-blue-600/50 text-blue-300 font-semibold">
              GUADALUPE - LA LIBERTAD
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Malla Táctica de 12 Cuadrantes • Monitoreo Ciudadano Despacho Cero
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-navy-850 border border-navy-700 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            {isConnected ? (
              <>
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>{connectionMode}</span>
              </>
            ) : (
              'DESCONECTADO'
            )}
          </span>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-navy-850 border border-navy-700 text-xs text-slate-300">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Incidentes Totales:</span>
          <strong className="text-white font-bold">{alertsCount}</strong>
        </div>

        {/* Reloj */}
        <div className="text-sm font-mono text-cyan-400 bg-navy-950 px-3 py-1 rounded-lg border border-navy-800">
          {time}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          title="Actualizar datos"
          className="p-2 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-300 hover:text-white transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
