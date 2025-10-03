// Base de datos de cultivos por región
// Simplificación del crops_agent.py original
export interface CropsByRegion {
  [key: string]: string[];
}

const cropDatabase: CropsByRegion = {
  // América Latina
  "mexico": ["maíz", "frijol", "chile", "tomate", "aguacate", "caña de azúcar"],
  "colombia": ["café", "plátano", "arroz", "papa", "caña de azúcar", "yuca"],
  "peru": ["papa", "quinua", "maíz", "café", "cacao", "arroz"],
  "argentina": ["soja", "trigo", "maíz", "girasol", "vid", "cebada"],
  "chile": ["uva", "manzana", "palta", "cerezo", "trigo", "maíz"],
  "brasil": ["soja", "caña de azúcar", "café", "maíz", "naranja", "algodón"],

  // Europa
  "españa": ["trigo", "cebada", "vid", "olivo", "girasol", "tomate"],
  "italia": ["trigo", "vid", "olivo", "tomate", "maíz", "arroz"],
  "francia": ["trigo", "cebada", "vid", "girasol", "maíz", "remolacha"],

  // Asia
  "india": ["arroz", "trigo", "algodón", "caña de azúcar", "té", "yute"],
  "china": ["arroz", "trigo", "maíz", "soja", "papa", "té"],
  "japon": ["arroz", "soja", "té", "cebada", "trigo"],

  // África
  "egipto": ["trigo", "arroz", "maíz", "algodón", "caña de azúcar"],
  "sudafrica": ["maíz", "trigo", "caña de azúcar", "girasol", "vid"],

  // América del Norte
  "usa": ["maíz", "soja", "trigo", "algodón", "papa", "tomate"],
  "canada": ["trigo", "canola", "cebada", "soja", "maíz"],
};

// Obtener nombre del país desde coordenadas usando geocoding inverso
export async function getLocationFromCoords(lat: number, lon: number): Promise<string> {
  try {
    // Usar nominatim de OpenStreetMap para geocoding inverso (gratuito)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`,
      {
        headers: {
          'User-Agent': 'AgroMine/2.0',
        },
      }
    );

    if (!response.ok) {
      return "ubicación desconocida";
    }

    const data = await response.json();
    const country = data.address?.country?.toLowerCase() || "desconocido";
    const city = data.address?.city || data.address?.town || data.address?.village || "";

    return city ? `${city}, ${country}` : country;
  } catch (error) {
    console.error('Error getting location:', error);
    return "ubicación desconocida";
  }
}

// Obtener cultivos populares de la región
export function getCropsForLocation(location: string): string[] {
  const locationLower = location.toLowerCase();

  // Buscar coincidencia en la base de datos
  for (const [region, crops] of Object.entries(cropDatabase)) {
    if (locationLower.includes(region)) {
      return crops;
    }
  }

  // Cultivos genéricos si no se encuentra la región
  return ["trigo", "maíz", "arroz", "papa", "tomate", "frijol"];
}

// Obtener ubicación y cultivos
export async function getLocationAndCrops(lat: number, lon: number): Promise<{
  location: string;
  crops: string[];
}> {
  const location = await getLocationFromCoords(lat, lon);
  const crops = getCropsForLocation(location);

  return {
    location,
    crops,
  };
}
