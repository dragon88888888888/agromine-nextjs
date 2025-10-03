import Link from "next/link";
import { Droplets, Sprout } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-green-800 dark:text-green-400 mb-4">
            AgroMine 2.0
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sistema inteligente de análisis agrícola para optimizar tu producción
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card Análisis de Siembra */}
          <Link
            href="/siembra"
            className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Análisis de Siembra
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Determina el momento ideal para sembrar basándote en datos climáticos,
                calidad del aire y condiciones regionales con IA.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Análisis de clima en tiempo real</li>
                <li>✓ Calidad del aire (AQI, CO2, PM2.5)</li>
                <li>✓ Recomendaciones de cultivos por región</li>
                <li>✓ Predicción de viabilidad con IA</li>
              </ul>
              <div className="mt-6 text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Comenzar análisis →
              </div>
            </div>
          </Link>

          {/* Card Análisis de Agua */}
          <Link
            href="/agua"
            className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Análisis de Calidad del Agua
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Evalúa la calidad del agua y determina sus usos viables:
                riego, consumo humano o aplicaciones industriales.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Análisis de parámetros fisicoquímicos</li>
                <li>✓ Evaluación de usos potenciales</li>
                <li>✓ Recomendaciones de tratamiento</li>
                <li>✓ Estándares internacionales (OMS, EPA)</li>
              </ul>
              <div className="mt-6 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Analizar agua →
              </div>
            </div>
          </Link>
        </div>

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p>Powered by IA con Google Gemini y OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  );
}
