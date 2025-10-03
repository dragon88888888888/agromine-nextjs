'use client';

import { useState } from 'react';
import { MapPin, Cloud, Wind, Droplets, AlertTriangle, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

interface WeatherData {
  weather: string;
  temp: number;
  air_quality: number;
  no2: number;
  pm10: number;
  pm2_5: number;
  co2_prediction: string;
  location: string;
  crops: string[];
  alerts: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SiembraPage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obtener ubicación del usuario
  const getLocation = () => {
    setLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          await fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError('No se pudo obtener la ubicación. Por favor, permite el acceso.');
          setLoading(false);
        }
      );
    } else {
      setError('Tu navegador no soporta geolocalización.');
      setLoading(false);
    }
  };

  // Obtener datos del clima
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Error al obtener datos del clima');

      const data = await response.json();
      setWeatherData(data);

      // Mensaje inicial del asistente
      setMessages([{
        role: 'assistant',
        content: `¡Hola! He analizado las condiciones en **${data.location}**.

**Datos del clima:**
- Temperatura: ${(data.temp - 273.15).toFixed(1)}°C
- Condición: ${data.weather}
- Calidad del aire (AQI): ${data.air_quality}
- ${data.co2_prediction}

**Cultivos populares:** ${data.crops.join(', ')}

${data.alerts && data.alerts.length > 0 ? `⚠️ **Alertas:** ${data.alerts.join(', ')}` : ''}

¿Qué te gustaría saber sobre la viabilidad de siembra en esta zona?`
      }]);

      setLoading(false);
    } catch (err) {
      setError('Error al cargar los datos del clima');
      setLoading(false);
    }
  };

  // Enviar mensaje al chat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !weatherData) return;

    const userMessage = input.trim();
    setInput('');

    // Agregar mensaje del usuario
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-siembra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          weatherData,
          crops: weatherData.crops,
          location: weatherData.location,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();

      // Agregar respuesta del asistente
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta de nuevo.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 dark:text-green-400 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-2">
            Análisis de Viabilidad de Siembra
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Determina el momento ideal para sembrar con IA
          </p>
        </div>

        {/* Botón para obtener ubicación */}
        {!weatherData && !loading && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <MapPin className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Comienza tu análisis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Necesitamos tu ubicación para obtener datos climáticos precisos
            </p>
            <button
              onClick={getLocation}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Obtener mi ubicación
            </button>
            {error && (
              <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            <span className="ml-4 text-gray-600 dark:text-gray-300">
              Cargando datos climáticos...
            </span>
          </div>
        )}

        {/* Dashboard de datos del clima + Chat */}
        {weatherData && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Panel de datos del clima */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{weatherData.location}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Clima
                </h3>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {(weatherData.temp - 273.15).toFixed(1)}°C
                </p>
                <p className="text-gray-600 dark:text-gray-300 capitalize">{weatherData.weather}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  Calidad del Aire
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AQI:</span>
                    <span className="font-semibold">{weatherData.air_quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">NO2:</span>
                    <span className="font-semibold">{weatherData.no2.toFixed(2)} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">PM10:</span>
                    <span className="font-semibold">{weatherData.pm10.toFixed(2)} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">PM2.5:</span>
                    <span className="font-semibold">{weatherData.pm2_5.toFixed(2)} µg/m³</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {weatherData.co2_prediction}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Cultivos Populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {weatherData.crops.map((crop, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {weatherData.alerts.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-700">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                    <AlertTriangle className="w-5 h-5" />
                    Alertas Climáticas
                  </h3>
                  <ul className="space-y-2">
                    {weatherData.alerts.map((alert, idx) => (
                      <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300">
                        • {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Panel de Chat con IA */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[700px] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-xl">Asistente de Siembra IA</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Consulta sobre viabilidad, cultivos recomendados y mejores prácticas
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Pregunta sobre siembra, cultivos, clima..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
