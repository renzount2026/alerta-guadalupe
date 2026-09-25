require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Supabase client setup if configured in environment
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (supabase) {
  console.log('[Supabase Cloud] Conectado a la base de datos PostgreSQL de Supabase');
} else {
  console.log('[In-Memory Mode] Supabase no configurado, utilizando almacenamiento en memoria');
}

function formatAlertFromDb(row) {
  return {
    id: row.id,
    citizen: row.citizen,
    alertType: row.alert_type,
    subType: row.sub_type,
    description: row.description,
    location: row.location,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    createdAt: row.created_at,
    status: row.status
  };
}

// In-memory store initialized with realistic alerts in Guadalupe
let alerts = [
  {
    id: "RPT-2026-001",
    citizen: {
      dni: "72345678",
      fullName: "Carlos Mendoza Ruiz",
      age: 28,
      phone: "+51 978 654 321"
    },
    alertType: "Alerta Seguridad",
    subType: "Asalto mano armada",
    description: "Dos sujetos a bordo de una moto lineal sin placa merodeando la bodega.",
    location: {
      lat: -7.2435,
      lng: -79.4704,
      addressReference: "Jr. Independencia frente a Plaza de Armas, C-01 Casco Histórico"
    },
    mediaUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    mediaType: "IMAGE",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: "REGISTRADO"
  },
  {
    id: "RPT-2026-002",
    citizen: {
      dni: "45891234",
      fullName: "Rosa Elena Vásquez",
      age: 34,
      phone: "+51 944 112 334"
    },
    alertType: "Actitud Sospechosa",
    subType: "Actitud Sospechosa",
    description: "Individuo tomando fotografías a las cerraduras de las viviendas en la cuadra.",
    location: {
      lat: -7.2396,
      lng: -79.4670,
      addressReference: "Av. Manuel Seoane cuadra 4, C-02 Barrio San Ramón"
    },
    mediaUrl: null,
    mediaType: null,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "REGISTRADO"
  },
  {
    id: "RPT-2026-003",
    citizen: {
      dni: "70129845",
      fullName: "Jorge Luis Alayo",
      age: 41,
      phone: "+51 987 556 778"
    },
    alertType: "Emergencia",
    subType: "Emergencia Inmediata",
    description: "Accidente vehicular con personas atrapadas frente al mercado de abastos.",
    location: {
      lat: -7.2415,
      lng: -79.4718,
      addressReference: "Jr. Ancash cruce con Ayacucho, C-06 Mercado Modelo"
    },
    mediaUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
    mediaType: "IMAGE",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    status: "REGISTRADO"
  },
  {
    id: "RPT-2026-004",
    citizen: {
      dni: "76543210",
      fullName: "Lucía Paredes Silva",
      age: 23,
      phone: "+51 961 889 001"
    },
    alertType: "Alerta Seguridad",
    subType: "Gresca",
    description: "Pelea callejera entre varios jóvenes con botellas rotas cerca del complejo deportivo.",
    location: {
      lat: -7.2448,
      lng: -79.4638,
      addressReference: "Jr. Lima oriente, C-04 Estadio Municipal Carlos A. Olivares"
    },
    mediaUrl: null,
    mediaType: null,
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    status: "REGISTRADO"
  }
];

// Server-Sent Events subscribers list
let sseClients = [];

// Send SSE update to all connected web dashboards
function broadcastAlert(alert) {
  const data = JSON.stringify({ type: 'NEW_ALERT', payload: alert });
  sseClients.forEach(client => {
    client.res.write(`data: ${data}\n\n`);
  });
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Alerta Guadalupe Server',
    database: supabase ? 'Supabase PostgreSQL' : 'In-Memory',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/alerts', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        const formatted = data.map(formatAlertFromDb);
        return res.json({
          success: true,
          source: 'supabase',
          count: formatted.length,
          data: formatted
        });
      }
    } catch (e) {
      console.warn('Error querying Supabase, fallback to memory:', e.message);
    }
  }

  res.json({
    success: true,
    source: 'in-memory',
    count: alerts.length,
    data: alerts
  });
});

app.post('/api/alerts', async (req, res) => {
  const incoming = req.body;
  
  if (!incoming || !incoming.alertType || !incoming.citizen || !incoming.location) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios en el payload (citizen, alertType, location)."
    });
  }

  const alertId = incoming.id || `RPT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  const createdAt = incoming.createdAt || new Date().toISOString();

  const newAlert = {
    id: alertId,
    citizen: {
      dni: incoming.citizen.dni || "",
      fullName: incoming.citizen.fullName || "Ciudadano Anónimo",
      age: Number(incoming.citizen.age) || 0,
      phone: incoming.citizen.phone || ""
    },
    alertType: incoming.alertType,
    subType: incoming.subType || incoming.alertType,
    description: incoming.description || "Sin descripción proporcionada",
    location: {
      lat: Number(incoming.location.lat) || -7.2435,
      lng: Number(incoming.location.lng) || -79.4705,
      addressReference: incoming.location.addressReference || "Guadalupe, La Libertad"
    },
    mediaUrl: incoming.mediaUrl || null,
    mediaType: incoming.mediaType || null,
    createdAt: createdAt,
    status: incoming.status || "REGISTRADO"
  };

  if (supabase) {
    try {
      const dbRecord = {
        id: newAlert.id,
        citizen: newAlert.citizen,
        alert_type: newAlert.alertType,
        sub_type: newAlert.subType,
        description: newAlert.description,
        location: newAlert.location,
        media_url: newAlert.mediaUrl,
        media_type: newAlert.mediaType,
        status: newAlert.status,
        created_at: newAlert.createdAt
      };

      const { data, error } = await supabase
        .from('alerts')
        .insert([dbRecord])
        .select()
        .single();

      if (!error && data) {
        const formatted = formatAlertFromDb(data);
        alerts.unshift(formatted);
        broadcastAlert(formatted);
        console.log(`[SUPABASE CLOUD ALERT] ${formatted.id} - ${formatted.alertType} de ${formatted.citizen.fullName}`);
        return res.status(201).json({
          success: true,
          source: 'supabase',
          message: "Alerta registrada correctamente en Supabase",
          data: formatted
        });
      }
    } catch (e) {
      console.warn('Error inserting to Supabase, saving in-memory:', e.message);
    }
  }

  alerts.unshift(newAlert);
  broadcastAlert(newAlert);

  console.log(`[ALERT RECEIVED] ${newAlert.id} - ${newAlert.alertType} (${newAlert.subType}) de ${newAlert.citizen.fullName}`);

  res.status(201).json({
    success: true,
    source: 'in-memory',
    message: "Alerta registrada correctamente",
    data: newAlert
  });
});

// SSE Endpoint for Live Web Dashboards
app.get('/api/alerts/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  let currentAlerts = alerts;
  if (supabase) {
    try {
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (data && data.length > 0) {
        currentAlerts = data.map(formatAlertFromDb);
      }
    } catch (e) {
      // fallback to in-memory
    }
  }

  // Send current alerts snapshot immediately
  res.write(`data: ${JSON.stringify({ type: 'INIT_ALERTS', payload: currentAlerts })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor de Alerta Ciudadana Guadalupe ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;
