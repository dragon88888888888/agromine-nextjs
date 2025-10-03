import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

// Configurar el modelo de Gemini
export const geminiModel = google('gemini-2.0-flash-exp');

// Función para generar texto con Gemini
export async function generateWithGemini(prompt: string) {
  const { text } = await generateText({
    model: geminiModel,
    prompt,
  });
  return text;
}

// Función para streaming con Gemini
export function streamWithGemini(messages: Array<{ role: string; content: string }>) {
  return streamText({
    model: geminiModel,
    messages,
  });
}
