# Guía de Despliegue en la Nube: Vercel + Supabase (Alerta Guadalupe)

Esta arquitectura convierte el proyecto en una plataforma en la nube Serverless de alta disponibilidad, costo cero (Free Tier) y latencia ultra baja para el Distrito de Guadalupe.

---

## 1. Configuración de Base de Datos en Supabase (PostgreSQL + Realtime)

1. Ingresa a [https://supabase.com](https://supabase.com) e inicia sesión con GitHub o correo.
2. Crea un nuevo proyecto:
   - **Name**: `alerta-guadalupe`
   - **Database Password**: (guarda tu contraseña segura)
   - **Region**: `South America (São Paulo)` o `East US` (para menor latencia desde Perú).
3. Ve a la pestaña **SQL Editor** en el menú lateral izquierdo.
4. Abre o copia el contenido de [supabase/schema.sql](file:///c:/Users/dokja/.gemini/antigravity-ide/scratch/alerta-guadalupe/supabase/schema.sql) y haz clic en **Run**.
   - Esto creará la tabla `alerts`, configurará políticas RLS de lectura e inserción pública, habilitará **Supabase Realtime WebSockets** e insertará las alertas iniciales de Guadalupe.
5. Ve a **Project Settings** > **API**:
   - Copia la **Project URL** (`https://xxxxxxxxxxxx.supabase.co`)
   - Copia la **anon public key** (`eyJhbGciOi...`)
   - Copia la **service_role secret key** (opcional, para funciones administrativas)

---

## 2. Despliegue en Vercel (Frontend Vite + Serverless API)

1. Ingresa a [https://vercel.com](https://vercel.com).
2. Haz clic en **Add New...** > **Project**.
3. Importa el repositorio Git de este proyecto.
4. En la sección **Environment Variables**, añade:
   - `SUPABASE_URL`: `https://tu-proyecto.supabase.co`
   - `SUPABASE_ANON_KEY`: `tu_clave_anon`
   - `VITE_SUPABASE_URL`: `https://tu-proyecto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `tu_clave_anon`
5. Haz clic en **Deploy**.
   - Vercel compilará automáticamente el frontend en `web/dist` y desplegará las Serverless Functions en `/api/*`.
   - Obtendrás una URL pública segura con HTTPS (ej. `https://alerta-guadalupe.vercel.app`).

---

## 3. Conexión desde el Aplicativo Android

1. Abre la aplicación móvil en tu teléfono o emulador.
2. En la pantalla inicial de **Registro de Ciudadano**:
   - En el campo **URL / Host del Servidor**, selecciona el botón rápido **Nube (Vercel)** o escribe directamente tu dominio:
     `https://tu-proyecto.vercel.app`
3. Al pulsar **Completar Registro y Continuar**, las alertas emitidas desde el teléfono se enviarán por HTTPS directo a Vercel/Supabase y aparecerán al instante en el mapa C4 de Guadalupe.
