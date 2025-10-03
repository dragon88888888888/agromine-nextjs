import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message, waterParameters, conversationHistory } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Construir el contexto del sistema
    const systemContext = `Eres un experto en calidad del agua y tratamiento de aguas.
Tu especialidad es analizar parámetros de calidad del agua y determinar
sus usos potenciales: consumo humano, riego agrícola, uso industrial,
recreativo, y mantenimiento de ecosistemas. Siempre recomiendas tratamientos
específicos cuando sea necesario y citas estándares internacionales de calidad del agua.

PARÁMETROS DE CALIDAD DEL AGUA:
${waterParameters || 'No se proporcionaron parámetros'}

Por favor, incluye en tu análisis:
1. Evaluación general de la calidad del agua basada en estos parámetros.
2. Posibles usos específicos (consumo humano, agrícola, industrial, recreativo, ecosistemas)
3. Para cada uso potencial: idoneidad actual, parámetros que cumplen/no cumplen, tratamientos necesarios
4. Sugerencias de tratamientos o procesos de mejora
5. Precauciones o consideraciones especiales
6. Explicación de cómo cada parámetro influye en la calidad

Respalda tus conclusiones con referencias a estándares (OMS, EPA, normativas locales).`;

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
        maxOutputTokens: 3000,
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
    console.error('Error in chat-agua API:', error);
    return NextResponse.json(
      { error: 'Error al procesar la consulta de calidad del agua' },
      { status: 500 }
    );
  }
}
