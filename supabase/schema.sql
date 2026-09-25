-- ============================================================
-- ALERTA GUADALUPE - SCHEMA DE BASE DE DATOS PARA SUPABASE
-- ============================================================
-- Este script crea la tabla de alertas de seguridad ciudadana,
-- configura índices de alta velocidad, habilita Row Level Security (RLS)
-- y activa la replicación Realtime por WebSockets para el dashboard web.
-- ============================================================

-- 1. Crear tabla de Alertas Ciudadanas
create table if not exists public.alerts (
    id text primary key,
    citizen jsonb not null,
    alert_type text not null,
    sub_type text not null,
    description text default '',
    location jsonb not null,
    media_url text,
    media_type text,
    status text default 'REGISTRADO',
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Índices para consultas de alta velocidad y filtros
create index if not exists idx_alerts_created_at on public.alerts (created_at desc);
create index if not exists idx_alerts_type on public.alerts (alert_type);
create index if not exists idx_alerts_status on public.alerts (status);

-- 3. Habilitar Seguridad a Nivel de Fila (RLS)
alter table public.alerts enable row level security;

-- Política de lectura pública: Permite al Dashboard Web y Móvil consultar alertas
create policy "Lectura pública de alertas" 
    on public.alerts 
    for select 
    using (true);

-- Política de inserción pública: Permite al App Android (ciudadano) y al simulador enviar reportes
create policy "Inserción pública de alertas" 
    on public.alerts 
    for insert 
    with check (true);

-- Política de actualización: Permite a Serenazgo actualizar estado (REGISTRADO -> ATENDIENDO -> RESUELTO)
create policy "Actualización de alertas" 
    on public.alerts 
    for update 
    using (true);

-- 4. Habilitar Supabase Realtime para la tabla alerts
-- Esto envía notificaciones instantáneas vía WebSockets a la web sin latencia de servidor
alter publication supabase_realtime add table public.alerts;

-- 5. Datos Semilla (Seed Data) para el Distrito de Guadalupe (La Libertad, Perú)
insert into public.alerts (id, citizen, alert_type, sub_type, description, location, media_url, media_type, created_at, status)
values
(
    'RPT-2026-001',
    '{"dni": "72345678", "fullName": "Carlos Mendoza Ruiz", "age": 28, "phone": "+51 978 654 321"}'::jsonb,
    'Alerta Seguridad',
    'Asalto mano armada',
    'Dos sujetos a bordo de una moto lineal sin placa merodeando la bodega.',
    '{"lat": -7.2435, "lng": -79.4704, "addressReference": "Jr. Independencia frente a Plaza de Armas, C-01 Casco Histórico"}'::jsonb,
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    'IMAGE',
    now() - interval '25 minutes',
    'REGISTRADO'
),
(
    'RPT-2026-002',
    '{"dni": "45891234", "fullName": "Rosa Elena Vásquez", "age": 34, "phone": "+51 944 112 334"}'::jsonb,
    'Actitud Sospechosa',
    'Actitud Sospechosa',
    'Individuo tomando fotografías a las cerraduras de las viviendas en la cuadra.',
    '{"lat": -7.2396, "lng": -79.4670, "addressReference": "Av. Manuel Seoane cuadra 4, C-02 Barrio San Ramón"}'::jsonb,
    null,
    null,
    now() - interval '15 minutes',
    'REGISTRADO'
),
(
    'RPT-2026-003',
    '{"dni": "70129845", "fullName": "Jorge Luis Alayo", "age": 41, "phone": "+51 987 556 778"}'::jsonb,
    'Emergencia',
    'Emergencia Inmediata',
    'Accidente vehicular con personas atrapadas frente al mercado de abastos.',
    '{"lat": -7.2415, "lng": -79.4718, "addressReference": "Jr. Ancash cruce con Ayacucho, C-06 Mercado Modelo"}'::jsonb,
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    'IMAGE',
    now() - interval '5 minutes',
    'REGISTRADO'
),
(
    'RPT-2026-004',
    '{"dni": "76543210", "fullName": "Lucía Paredes Silva", "age": 23, "phone": "+51 961 889 001"}'::jsonb,
    'Alerta Seguridad',
    'Gresca',
    'Pelea callejera entre varios jóvenes con botellas rotas cerca del complejo deportivo.',
    '{"lat": -7.2448, "lng": -79.4638, "addressReference": "Jr. Lima oriente, C-04 Estadio Municipal Carlos A. Olivares"}'::jsonb,
    null,
    null,
    now() - interval '2 minutes',
    'REGISTRADO'
)
on conflict (id) do nothing;
