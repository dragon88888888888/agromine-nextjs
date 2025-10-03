'use client';

import { useState } from 'react';
import { Droplets, Loader2, Send, Beaker, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface WaterParameter {
  name: string;
  value: string;
  unit: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AguaPage() {
  const [parameters, setParameters] = useState<WaterParameter[]>([
    { name: 'pH', value: '', unit: '' },
    { name: 'Temperatura', value: '', unit: '°C' },
    { name: 'Turbidez', value: '', unit: 'NTU' },
  ]);

  const [analyzing, setAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function formatParameters(): string {
    return parameters
      .filter((p) => p.value.trim() !== '')
      .map((p) => `${p.name}: ${p.value} ${p.unit}`)
      .join('\n');
  }

  const addParameter = () => {
    setParameters([...parameters, { name: '', value: '', unit: '' }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: keyof WaterParameter, value: string) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  const startAnalysis = async () => {
    const params = formatParameters().trim();
    if (params === '') {
      alert('Por favor, ingresa al menos un parámetro de agua');
      return;
    }

    setAnalyzing(true);
    setIsLoading(true);

    // Crear mensaje inicial
    const initialMessage: Message = {
      role: 'assistant',
      content: `¡Hola! He recibido los siguientes parámetros de calidad del agua:

${params}

Déjame analizar estos datos y proporcionarte una evaluación completa...`,
    };

    setMessages([initialMessage]);

    try {
      const response = await fetch('/api/chat-agua', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Analiza estos parámetros de calidad del agua',
          waterParameters: params,
          conversationHistory: [],
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();

      setMessages([initialMessage, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([initialMessage, {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al analizar los parámetros. Por favor, intenta de nuevo.'
      }]);
    } finally {
      setAnalyzing(false);
      setIsLoading(false);
    }
  };

  // Enviar mensaje al chat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-agua', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          waterParameters: formatParameters(),
          conversationHistory: messages,
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2">
            Análisis de Calidad del Agua
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Evalúa parámetros fisicoquímicos y determina usos viables del agua
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel de entrada de parámetros */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Beaker className="w-6 h-6 text-blue-600" />
                Parámetros del Agua
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Ingresa los valores medidos de tu muestra de agua
              </p>

              <div className="space-y-4 mb-6">
                {parameters.map((param, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Parámetro {index + 1}
                      </label>
                      {parameters.length > 1 && (
                        <button
                          onClick={() => removeParameter(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nombre (ej: pH, Cloro, DBO)"
                        value={param.name}
                        onChange={(e) => updateParameter(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Valor"
                          value={param.value}
                          onChange={(e) => updateParameter(index, 'value', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Unidad"
                          value={param.unit}
                          onChange={(e) => updateParameter(index, 'unit', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addParameter}
                className="w-full mb-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar parámetro
              </button>

              <button
                onClick={startAnalysis}
                disabled={analyzing || messages.length > 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Iniciando análisis...
                  </>
                ) : messages.length > 0 ? (
                  'Análisis en curso'
                ) : (
                  <>
                    <Droplets className="w-5 h-5" />
                    Analizar agua
                  </>
                )}
              </button>

              {messages.length > 0 && (
                <button
                  onClick={() => {
                    setMessages([]);
                    setParameters([
                      { name: 'pH', value: '', unit: '' },
                      { name: 'Temperatura', value: '', unit: '°C' },
                      { name: 'Turbidez', value: '', unit: 'NTU' },
                    ]);
                  }}
                  className="w-full mt-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Nuevo análisis
                </button>
              )}

              {/* Parámetros comunes sugeridos */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-400 mb-2">
                  Parámetros comunes:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• pH (6.5-8.5)</li>
                  <li>• Temperatura (°C)</li>
                  <li>• Turbidez (NTU)</li>
                  <li>• Cloro residual (mg/L)</li>
                  <li>• Oxígeno disuelto (mg/L)</li>
                  <li>• DBO5 (mg/L)</li>
                  <li>• DQO (mg/L)</li>
                  <li>• Coliformes (UFC/100ml)</li>
                  <li>• Conductividad (µS/cm)</li>
                  <li>• Sólidos totales (mg/L)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Panel de Chat con IA */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[700px] flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-xl">Análisis de Calidad del Agua con IA</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Evaluación de usos potenciales y recomendaciones de tratamiento
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center max-w-md">
                    <Droplets className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      Listo para analizar
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ingresa los parámetros de tu muestra de agua en el panel izquierdo
                      y haz clic en &quot;Analizar agua&quot; para comenzar.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
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
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
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
                        placeholder="Pregunta sobre los resultados, tratamientos, usos..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Enviar
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
