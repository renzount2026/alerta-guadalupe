/**
 * Definición Geográfica de los 12 Cuadrantes Tácticos de Guadalupe (La Libertad, Perú)
 * Centro Urbano: lat: -7.2475, lng: -79.4795
 */
export const GUADALUPE_CENTER = [-7.2435, -79.4705];
export const DEFAULT_ZOOM = 15;

export const QUADRANTS = [
  {
    id: "C-01",
    name: "Plaza de Armas & Casco Histórico",
    description: "Plaza de Armas, Santuario San Agustín, Jr. Independencia, Jr. Junín y Municipalidad.",
    color: "#3B82F6", // Blue
    center: [-7.2435, -79.4704],
    bounds: [
      [-7.2418, -79.4725],
      [-7.2418, -79.4682],
      [-7.2452, -79.4682],
      [-7.2452, -79.4725]
    ]
  },
  {
    id: "C-02",
    name: "Av. Manuel Seoane & Barrio San Ramón",
    description: "Eje comercial Av. Manuel Seoane, Calle César Vallejo, Jr. San Ramón y salida a Chepén.",
    color: "#06B6D4", // Cyan
    center: [-7.2396, -79.4670],
    bounds: [
      [-7.2375, -79.4695],
      [-7.2375, -79.4645],
      [-7.2418, -79.4645],
      [-7.2418, -79.4695]
    ]
  },
  {
    id: "C-03",
    name: "Av. Industrial & Eje Agroindustrial",
    description: "Molinos de arroz, UNT Sede Valle Jequetepeque, Av. Circunvalación y almacenes logísticos.",
    color: "#8B5CF6", // Purple
    center: [-7.2395, -79.4605],
    bounds: [
      [-7.2360, -79.4645],
      [-7.2360, -79.4565],
      [-7.2435, -79.4565],
      [-7.2435, -79.4645]
    ]
  },
  {
    id: "C-04",
    name: "Estadio Municipal Carlos A. Olivares & Sector Este",
    description: "Estadio Carlos A. Olivares, Jr. Lima oriente, complejo deportivo y áreas recreativas.",
    color: "#10B981", // Emerald
    center: [-7.2450, -79.4640],
    bounds: [
      [-7.2435, -79.4682],
      [-7.2435, -79.4605],
      [-7.2475, -79.4605],
      [-7.2475, -79.4682]
    ]
  },
  {
    id: "C-05",
    name: "Urb. El Cafetal & Los Sauces",
    description: "Urb. El Cafetal, Calle Santa Rosa, Acequia Guadalupe, Calle 3 de Mayo y zona residencial sureste.",
    color: "#EC4899", // Pink
    center: [-7.2495, -79.4645],
    bounds: [
      [-7.2475, -79.4685],
      [-7.2475, -79.4595],
      [-7.2530, -79.4595],
      [-7.2530, -79.4685]
    ]
  },
  {
    id: "C-06",
    name: "Mercado Modelo & Comercio Central",
    description: "Mercado de Abastos Central, Jr. Ancash, Calle Balarezo, Jr. Ayacucho comercial.",
    color: "#F59E0B", // Amber
    center: [-7.2415, -79.4720],
    bounds: [
      [-7.2395, -79.4745],
      [-7.2395, -79.4695],
      [-7.2435, -79.4695],
      [-7.2435, -79.4745]
    ]
  },
  {
    id: "C-07",
    name: "Urbanización Talla & Sector Noreste",
    description: "Urbanización Talla, Av. Indoamérica, Calle José Carlos Mariátegui y expansión urbana norte.",
    color: "#6366F1", // Indigo
    center: [-7.2355, -79.4660],
    bounds: [
      [-7.2325, -79.4700],
      [-7.2325, -79.4615],
      [-7.2375, -79.4615],
      [-7.2375, -79.4700]
    ]
  },
  {
    id: "C-08",
    name: "San José & Cementerio San Lázaro",
    description: "Cementerio San Lázaro, Prolongación Jr. Independencia, San José y accesos noroccidentales.",
    color: "#14B8A6", // Teal
    center: [-7.2370, -79.4765],
    bounds: [
      [-7.2335, -79.4815],
      [-7.2335, -79.4725],
      [-7.2395, -79.4725],
      [-7.2395, -79.4815]
    ]
  },
  {
    id: "C-09",
    name: "Comisaría PNP & Barrio La Victoria",
    description: "Comisaría PNP Guadalupe, Av. Nila Cerruti, Av. América, Jr. Victoria oeste, Loreto y Arequipa.",
    color: "#38BDF8", // Sky
    center: [-7.2465, -79.4760],
    bounds: [
      [-7.2435, -79.4795],
      [-7.2435, -79.4725],
      [-7.2490, -79.4725],
      [-7.2490, -79.4795]
    ]
  },
  {
    id: "C-10",
    name: "La Calera & Mirador Cerro de la Virgen",
    description: "Santuario del Cerrito de la Virgen, mirador panorámico, acceso a La Calera y ladera oeste.",
    color: "#F97316", // Orange
    center: [-7.2445, -79.4840],
    bounds: [
      [-7.2405, -79.4885],
      [-7.2405, -79.4795],
      [-7.2485, -79.4795],
      [-7.2485, -79.4885]
    ]
  },
  {
    id: "C-11",
    name: "Av. Tomás Ganoza & Terminal Terrestre",
    description: "Av. Tomás Ganoza, Av. Pacasmayo, Calle Los Pinos, terminales terrestres y paraderos sur.",
    color: "#EF4444", // Red
    center: [-7.2505, -79.4735],
    bounds: [
      [-7.2475, -79.4775],
      [-7.2475, -79.4695],
      [-7.2540, -79.4695],
      [-7.2540, -79.4775]
    ]
  },
  {
    id: "C-12",
    name: "Corredor Semán & Entrada Panamericana Sur",
    description: "Acceso sur Panamericana hacia Ciudad de Dios, Centro Poblado Semán y sector periurbano sur.",
    color: "#A855F7", // Purple Accent
    center: [-7.2570, -79.4730],
    bounds: [
      [-7.2540, -79.4785],
      [-7.2540, -79.4675],
      [-7.2615, -79.4675],
      [-7.2615, -79.4785]
    ]
  }
];
