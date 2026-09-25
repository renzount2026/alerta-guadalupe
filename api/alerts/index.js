const { createClient } = require('@supabase/supabase-js');
const defaultAlerts = require('../_seed');

// Persistent cache in lambda instance memory
let inMemoryAlerts = [...defaultAlerts];

// Initialize Supabase if credentials are provided
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

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

module.exports = async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      if (supabase) {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data) {
          const formatted = data.map(formatAlertFromDb);
          return res.status(200).json({
            success: true,
            source: 'supabase',
            count: formatted.length,
            data: formatted
          });
        }
        console.warn('Supabase fetch error, fallback to memory:', error?.message);
      }

      return res.status(200).json({
        success: true,
        source: 'in-memory',
        count: inMemoryAlerts.length,
        data: inMemoryAlerts
      });
    }

    if (req.method === 'POST') {
      const incoming = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!incoming || !incoming.alertType || !incoming.citizen || !incoming.location) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios en el payload (citizen, alertType, location).'
        });
      }

      const alertId = incoming.id || `RPT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
      const createdAt = incoming.createdAt || new Date().toISOString();

      if (supabase) {
        const dbRecord = {
          id: alertId,
          citizen: {
            dni: incoming.citizen.dni || '',
            fullName: incoming.citizen.fullName || 'Ciudadano Anónimo',
            age: Number(incoming.citizen.age) || 0,
            phone: incoming.citizen.phone || ''
          },
          alert_type: incoming.alertType,
          sub_type: incoming.subType || incoming.alertType,
          description: incoming.description || 'Sin descripción',
          location: {
            lat: Number(incoming.location.lat) || -7.2435,
            lng: Number(incoming.location.lng) || -79.4705,
            addressReference: incoming.location.addressReference || 'Guadalupe, La Libertad'
          },
          media_url: incoming.mediaUrl || null,
          media_type: incoming.mediaType || null,
          status: incoming.status || 'REGISTRADO',
          created_at: createdAt
        };

        const { data, error } = await supabase
          .from('alerts')
          .insert([dbRecord])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error.message);
          // Fallback to local memory if Supabase table or keys fail
        } else if (data) {
          const formatted = formatAlertFromDb(data);
          inMemoryAlerts.unshift(formatted);
          return res.status(201).json({
            success: true,
            source: 'supabase',
            message: 'Alerta registrada exitosamente en Supabase Cloud',
            data: formatted
          });
        }
      }

      // In-memory fallback
      const fallbackAlert = {
        id: alertId,
        citizen: {
          dni: incoming.citizen.dni || '',
          fullName: incoming.citizen.fullName || 'Ciudadano Anónimo',
          age: Number(incoming.citizen.age) || 0,
          phone: incoming.citizen.phone || ''
        },
        alertType: incoming.alertType,
        subType: incoming.subType || incoming.alertType,
        description: incoming.description || 'Sin descripción',
        location: {
          lat: Number(incoming.location.lat) || -7.2435,
          lng: Number(incoming.location.lng) || -79.4705,
          addressReference: incoming.location.addressReference || 'Guadalupe, La Libertad'
        },
        mediaUrl: incoming.mediaUrl || null,
        mediaType: incoming.mediaType || null,
        createdAt: createdAt,
        status: incoming.status || 'REGISTRADO'
      };

      inMemoryAlerts.unshift(fallbackAlert);

      return res.status(201).json({
        success: true,
        source: 'in-memory',
        message: 'Alerta registrada (modo local/resiliente)',
        data: fallbackAlert
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};
