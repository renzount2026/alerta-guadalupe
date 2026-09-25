import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export function formatAlertFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    citizen: typeof row.citizen === 'string' ? JSON.parse(row.citizen) : row.citizen,
    alertType: row.alert_type || row.alertType,
    subType: row.sub_type || row.subType,
    description: row.description || '',
    location: typeof row.location === 'string' ? JSON.parse(row.location) : row.location,
    mediaUrl: row.media_url !== undefined ? row.media_url : row.mediaUrl,
    mediaType: row.media_type !== undefined ? row.media_type : row.mediaType,
    createdAt: row.created_at || row.createdAt,
    status: row.status || 'REGISTRADO'
  };
}
