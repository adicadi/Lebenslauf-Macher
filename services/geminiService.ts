import { GoogleGenAI } from "@google/genai";
import { AIOperationType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are an expert German HR Consultant and Resume Writer. 
Your goal is to help users create professional "Lebenslauf" (CVs) for the German market.
Tone: Professional, formal, precise, active voice.
Language: German (Standard High German).
`;

export const enhanceText = async (
  text: string, 
  operation: AIOperationType,
  context?: string
): Promise<string> => {
  if (!text.trim()) return "";
  
  if (!apiKey) {
    console.warn("No API Key provided");
    return text;
  }

  let prompt = "";

  switch (operation) {
    case 'polish':
      prompt = `Rewrite the following text to be more professional, using strong action verbs suitable for a German CV. Keep it concise. Input text: "${text}"`;
      break;
    case 'translate_to_german':
      prompt = `Translate the following text to professional German suitable for a CV. Input text: "${text}"`;
      break;
    case 'fix_grammar':
      prompt = `Correct the grammar and spelling of the following German text. Do not change the meaning excessively, just fix errors. Input text: "${text}"`;
      break;
    default:
      prompt = `Improve this text for a resume: "${text}"`;
  }

  if (context) {
    prompt += `\nContext: This is for the ${context} section of the resume.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Lower temperature for more deterministic/professional output
      }
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to original text if AI fails
    return text;
  }
};