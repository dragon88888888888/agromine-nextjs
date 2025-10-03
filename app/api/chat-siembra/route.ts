import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message, weatherData, crops, location, conversationHistory } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Construir el contexto del sistema
    const systemContext = `Eres un experto agrónomo especializado en análisis de condiciones climáticas,
calidad del aire y cómo estas influyen en el cultivo y la cosecha.
Proporciona análisis detallados, científicos pero accesibles, y siempre incluye
porcentajes de viabilidad basados en datos concretos.

CONTEXTO DE LA UBICACIÓN:
- Ubicación: ${location}
- Temperatura: ${weatherData.temp}K (${(weatherData.temp - 273.15).toFixed(1)}°C)
- Clima: ${weatherData.weather}
- Calidad del aire (AQI): ${weatherData.air_quality}
- NO2: ${weatherData.no2} µg/m³
- PM10: ${weatherData.pm10} µg/m³
- PM2.5: ${weatherData.pm2_5} µg/m³
- ${weatherData.co2_prediction}
- Cultivos populares en la región: ${crops.join(', ')}
${weatherData.alerts && weatherData.alerts.length > 0 ? `- Alertas climáticas: ${weatherData.alerts.join(', ')}` : ''}`;

    // Construir el historial de conversación (solo mensajes de usuario y modelo, no el inicial del asistente)
    interface ConversationMessage {
      role: string;
      content: string;
    }

    const history = (conversationHistory || [])
      .filter((msg: ConversationMessage) => msg.role === 'user' || (msg.role === 'assistant' && conversationHistory.indexOf(msg) > 0))
      .map((msg: ConversationMessage) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    // Enviar mensaje con contexto (siempre incluir contexto en el primer mensaje del usuario)
    const isFirstUserMessage = conversationHistory.length <= 1;
    const fullMessage = isFirstUserMessage
      ? `${systemContext}\n\n${message}`
      : message;

    const result = await chat.sendMessage(fullMessage);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in chat-siembra API:', error);
    return NextResponse.json(
      { error: 'Error al procesar la consulta' },
      { status: 500 }
    );
  }
}
