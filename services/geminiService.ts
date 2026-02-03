import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTextResponse = async (
  history: { role: string; text: string }[],
  newMessage: string,
  context?: string
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct a system instruction that includes the document context if available
    const systemInstruction = `You are a helpful scientific research assistant. 
    You help users write academic papers, find citations, and refine their arguments.
    ${context ? `Current Document Context:\n${context}` : ''}`;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Text API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};
