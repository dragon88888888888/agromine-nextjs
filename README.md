# AgroMine 2.0 🌱💧

Sistema inteligente de análisis agrícola para optimizar la producción mediante IA. AgroMine 2.0 te ayuda a:

- **Determinar el momento ideal para sembrar** basándose en datos climáticos en tiempo real
- **Analizar la calidad del agua** para determinar sus usos viables (riego, consumo, industrial)
- **Recibir recomendaciones personalizadas** con IA (Google Gemini)

## 🚀 Características

### 📊 Análisis de Viabilidad de Siembra
- Datos climáticos en tiempo real (temperatura, clima, pronóstico)
- Análisis de calidad del aire (AQI, NO2, PM10, PM2.5, CO2)
- Cultivos populares recomendados por región
- Chat interactivo con IA para consultas sobre siembra
- Alertas climáticas automáticas

### 💧 Análisis de Calidad del Agua
- Evaluación de parámetros fisicoquímicos personalizables
- Determinación de usos potenciales del agua
- Recomendaciones de tratamiento basadas en estándares internacionales (OMS, EPA)
- Chat con experto en calidad del agua potenciado por IA

## 🛠️ Tecnologías

- **Framework:** Next.js 15 con App Router
- **UI:** React 19, TailwindCSS, Lucide Icons
- **IA:** Vercel AI SDK + Google Gemini 2.0 Flash
- **APIs:** OpenWeatherMap (clima), OpenStreetMap Nominatim (geocoding)
- **TypeScript** para type safety

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- npm o pnpm
- API Keys:
  - [Google Gemini API Key](https://makersuite.google.com/app/apikey)
  - [OpenWeatherMap API Key](https://openweathermap.org/api)

### Pasos

1. **Instalar dependencias**

```bash
npm install
# o
pnpm install
```

2. **Configurar variables de entorno**

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus API keys:

```env
GOOGLE_GENERATIVE_AI_API_KEY=tu_clave_de_gemini_aqui
OPENWEATHER_API_KEY=tu_clave_de_openweather_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Ejecutar en desarrollo**

```bash
npm run dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🗂️ Estructura del Proyecto

```
agromine-nextjs/
├── app/
│   ├── api/
│   │   ├── weather/route.ts          # API de datos climáticos
│   │   ├── chat-siembra/route.ts     # Chat IA para siembra
│   │   └── chat-agua/route.ts        # Chat IA para agua
│   ├── siembra/
│   │   └── page.tsx                  # Página de análisis de siembra
│   ├── agua/
│   │   └── page.tsx                  # Página de análisis de agua
│   ├── layout.tsx                    # Layout raíz
│   └── page.tsx                      # Página principal
├── lib/
│   ├── gemini.ts                     # Utilidades de Gemini
│   ├── weather.ts                    # Utilidades de clima
│   └── crops.ts                      # Datos de cultivos por región
├── .env.example                      # Variables de entorno ejemplo
└── README.md
```

## 🎯 Uso

### Análisis de Siembra

1. Ve a la página de **Análisis de Siembra**
2. Permite el acceso a tu ubicación
3. Revisa los datos climáticos y de calidad del aire
4. Consulta con el asistente de IA sobre:
   - Viabilidad de siembra
   - Mejores cultivos para tu región
   - Impacto del clima en tus cultivos
   - Recomendaciones de timing

### Análisis de Agua

1. Ve a la página de **Análisis de Agua**
2. Ingresa los parámetros fisicoquímicos de tu muestra:
   - pH, Temperatura, Turbidez
   - Cloro, Oxígeno disuelto
   - DBO, DQO, Coliformes
   - Cualquier otro parámetro relevante
3. Haz clic en "Analizar agua"
4. Revisa la evaluación de IA sobre:
   - Usos potenciales del agua
   - Tratamientos recomendados
   - Cumplimiento de estándares
   - Precauciones especiales

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard
3. Deploy automático en cada push

```bash
# O usando Vercel CLI
npm install -g vercel
vercel
```

### Otros Hostings

La aplicación es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Migración desde Flask

Este proyecto es una migración completa de AgroMine 1.0 (Flask + Python) a Next.js. Principales cambios:

| Característica | Flask (v1) | Next.js (v2) |
|----------------|-----------|--------------|
| Backend | Flask + Python | Next.js API Routes |
| Frontend | HTML templates | React + TypeScript |
| IA | google.generativeai | Vercel AI SDK + Gemini |
| GraphRAG | LlamaIndex + OpenAI | Simplificado con Gemini |
| Streaming | No | Sí (respuestas en tiempo real) |
| Type Safety | No | Sí (TypeScript) |

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- Google Gemini por la API de IA
- OpenWeatherMap por datos climáticos
- Vercel por el AI SDK
- La comunidad de Next.js

---

**Desarrollado con ❤️ para agricultores e ingenieros ambientales**
