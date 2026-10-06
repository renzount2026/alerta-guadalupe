/**
 * Definición Geográfica de los 12 Cuadrantes Tácticos de Guadalupe (La Libertad, Perú)
 * Centro Urbano: lat: -7.2475, lng: -79.4795
 */
export const GUADALUPE_CENTER = [-7.2435, -79.4705];
export const DEFAULT_ZOOM = 15;

/**
 * Malla Táctica de 12 Cuadrantes de Guadalupe (3 columnas x 4 filas)
 * Delimitación continua y perfectamente alineada sobre el casco urbano.
 *
 * Latitudes (4 líneas, 3 intervalos):
 * - Norte: -7.2330
 * - Línea 1: -7.2380
 * - Línea 2: -7.2425
 * - Línea 3: -7.2475
 * - Sur: -7.2535
 *
 * Longitudes (3 columnas, 4 líneas):
 * - Oeste: -79.4780
 * - Línea 1: -79.4725
 * - Línea 2: -79.4675
 * - Este: -79.4585
 */
export const QUADRANTS = [
  // FILA 3 - CENTRO CÍVICO & CASCO HISTÓRICO
  {
    id: "C-01",
    name: "Plaza de Armas & Casco Histórico",
    description: "Plaza de Armas, Santuario San Agustín, Jr. Independencia, Jr. Junín y Municipalidad.",
    color: "#2563EB", // Royal Blue
    center: [-7.2450, -79.4700],
    bounds: [
      [-7.2425, -79.4725],
      [-7.2425, -79.4675],
      [-7.2475, -79.4675],
      [-7.2475, -79.4725]
    ]
  },
  // FILA 2 - NORTE CENTRO / SAN RAMÓN
  {
    id: "C-02",
    name: "Av. Manuel Seoane & Barrio San Ramón",
    description: "Eje comercial Av. Manuel Seoane, Calle César Vallejo, Jr. San Ramón y acceso norte a Chepén.",
    color: "#06B6D4", // Cyan
    center: [-7.2402, -79.4630],
    bounds: [
      [-7.2380, -79.4675],
      [-7.2380, -79.4585],
      [-7.2425, -79.4585],
      [-7.2425, -79.4675]
    ]
  },
  // FILA 1 - NOR-ESTE AGROINDUSTRIAL
  {
    id: "C-03",
    name: "Av. Industrial & Eje Agroindustrial",
    description: "Molinos de arroz, UNT Sede Valle Jequetepeque, Av. Circunvalación y almacenes logísticos.",
    color: "#8B5CF6", // Purple
    center: [-7.2355, -79.4630],
    bounds: [
      [-7.2330, -79.4675],
      [-7.2330, -79.4585],
      [-7.2380, -79.4585],
      [-7.2380, -79.4675]
    ]
  },
  // FILA 3 - CENTRO-ESTE DEPORTIVO
  {
    id: "C-04",
    name: "Estadio Carlos A. Olivares & Sector Este",
    description: "Estadio Carlos A. Olivares, Jr. Lima oriente, Calle Rázuri, complejo deportivo y áreas recreativas.",
    color: "#10B981", // Emerald
    center: [-7.2450, -79.4630],
    bounds: [
      [-7.2425, -79.4675],
      [-7.2425, -79.4585],
      [-7.2475, -79.4585],
      [-7.2475, -79.4675]
    ]
  },
  // FILA 4 - SUR-ESTE RESIDENCIAL
  {
    id: "C-05",
    name: "Urb. El Cafetal & Los Sauces",
    description: "Urb. El Cafetal, Calle Santa Rosa, Av. La Alameda, Acequia Guadalupe y zona residencial sureste.",
    color: "#EC4899", // Pink
    center: [-7.2505, -79.4630],
    bounds: [
      [-7.2475, -79.4675],
      [-7.2475, -79.4585],
      [-7.2535, -79.4585],
      [-7.2535, -79.4675]
    ]
  },
  // FILA 2 - CENTRO-OESTE COMERCIAL / ABASTOS
  {
    id: "C-06",
    name: "Mercado Modelo & Comercio Central",
    description: "Mercado de Abastos Central, Jr. Ancash, Calle Balarezo, Jr. Ayacucho comercial.",
    color: "#F59E0B", // Amber
    center: [-7.2402, -79.4700],
    bounds: [
      [-7.2380, -79.4725],
      [-7.2380, -79.4675],
      [-7.2425, -79.4675],
      [-7.2425, -79.4725]
    ]
  },
  // FILA 1 - NORTE RESIDENCIAL / INDOAMÉRICA
  {
    id: "C-07",
    name: "Urbanización Talla & Sector Noreste",
    description: "Urbanización Talla, Av. Indoamérica, Calle Mariano Melgar, Jr. José Carlos Mariátegui y norte.",
    color: "#6366F1", // Indigo
    center: [-7.2355, -79.4700],
    bounds: [
      [-7.2330, -79.4725],
      [-7.2330, -79.4675],
      [-7.2380, -79.4675],
      [-7.2380, -79.4725]
    ]
  },
  // FILA 1 - NOR-OESTE / CEMENTERIO
  {
    id: "C-08",
    name: "San José & Cementerio San Lázaro",
    description: "Cementerio San Lázaro, Prolongación Jr. Independencia, San José y accesos noroccidentales.",
    color: "#14B8A6", // Teal
    center: [-7.2355, -79.4752],
    bounds: [
      [-7.2330, -79.4780],
      [-7.2330, -79.4725],
      [-7.2380, -79.4725],
      [-7.2380, -79.4780]
    ]
  },
  // FILA 3 - SUR-OESTE POLICIAL / LA VICTORIA
  {
    id: "C-09",
    name: "Comisaría PNP & Barrio La Victoria",
    description: "Comisaría PNP Guadalupe, Av. América oeste, Jr. La Victoria, Jr. Loreto, Jr. Arequipa y 5 de Diciembre.",
    color: "#38BDF8", // Sky
    center: [-7.2450, -79.4752],
    bounds: [
      [-7.2425, -79.4780],
      [-7.2425, -79.4725],
      [-7.2475, -79.4725],
      [-7.2475, -79.4780]
    ]
  },
  // FILA 2 - OESTE MIRADOR / LA CALERA
  {
    id: "C-10",
    name: "La Calera & Mirador Cerro de la Virgen",
    description: "Santuario del Cerrito de la Virgen, mirador panorámico, Av. 5 de Diciembre y ladera oeste.",
    color: "#F97316", // Orange
    center: [-7.2402, -79.4752],
    bounds: [
      [-7.2380, -79.4780],
      [-7.2380, -79.4725],
      [-7.2425, -79.4725],
      [-7.2425, -79.4780]
    ]
  },
  // FILA 4 - SUR-OESTE TERMINAL & GANOZA
  {
    id: "C-11",
    name: "Av. Tomás Ganoza & Terminal Terrestre",
    description: "Av. Tomás Ganoza, Av. Pacasmayo suroeste, Calle Los Pinos, terminales terrestres y paraderos.",
    color: "#EF4444", // Red
    center: [-7.2505, -79.4752],
    bounds: [
      [-7.2475, -79.4780],
      [-7.2475, -79.4725],
      [-7.2535, -79.4725],
      [-7.2535, -79.4780]
    ]
  },
  // FILA 4 - SUR CENTRO PANAMERICANA
  {
    id: "C-12",
    name: "Corredor Semán & Entrada Panamericana Sur",
    description: "Cruce Carretera Panamericana Norte (PE-1N), Pasaje Hawái, Calle Los Cedros, Palmeras y acceso sur.",
    color: "#A855F7", // Purple Accent
    center: [-7.2505, -79.4700],
    bounds: [
      [-7.2475, -79.4725],
      [-7.2475, -79.4675],
      [-7.2535, -79.4675],
      [-7.2535, -79.4725]
    ]
  }
];
