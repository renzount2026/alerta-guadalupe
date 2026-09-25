module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const hasSupabase = Boolean(
    (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)
  );

  res.status(200).json({
    status: 'healthy',
    service: 'Alerta Guadalupe Cloud API',
    platform: 'Vercel Serverless',
    timestamp: new Date().toISOString(),
    database: hasSupabase ? 'Supabase PostgreSQL (Connected)' : 'In-Memory (Mock)'
  });
};
