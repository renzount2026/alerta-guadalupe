const { createClient } = require('@supabase/supabase-js');
const defaultAlerts = require('../_seed');

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  let alerts = [...defaultAlerts];

  if (supabase) {
    try {
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (data && data.length > 0) {
        alerts = data.map(formatAlertFromDb);
      }
    } catch (e) {
      console.warn('Error fetching alerts for stream:', e.message);
    }
  }

  // Send current snapshot
  res.write(`data: ${JSON.stringify({ type: 'INIT_ALERTS', payload: alerts })}\n\n`);

  // Send a heartbeat ping
  res.write(`data: ${JSON.stringify({ type: 'PING', timestamp: new Date().toISOString() })}\n\n`);

  // Allow closing properly on serverless timeout
  req.on('close', () => {
    res.end();
  });
};
