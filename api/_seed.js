// Seed data for fallback when Supabase credentials are not yet configured
module.exports = [
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
