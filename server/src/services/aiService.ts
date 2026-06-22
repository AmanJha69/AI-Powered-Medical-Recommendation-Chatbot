import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, IMessageMetadata } from '../models/Message';
import { findDoctorsBySymptom, findDoctorsBySpecialty } from './doctorService';

export interface AIResponse {
  reply: string;
  metadata: IMessageMetadata;
}

const SYSTEM_PROMPT = `You are a helpful healthcare assistant chatbot. You provide general health information and suggestions based on symptoms.

IMPORTANT RULES:
- You are NOT a doctor and cannot provide definitive diagnoses. Use phrases like "possible", "may", "could be".
- For emergency symptoms (chest pain, difficulty breathing, severe bleeding, stroke signs, loss of consciousness), set urgency to "high" and strongly urge immediate emergency care.
- Only suggest over-the-counter (OTC) medicines when appropriate. Never suggest controlled substances.
- Always recommend consulting a healthcare professional for persistent or worsening symptoms.

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "reply": "Your friendly, empathetic response to the user",
  "possibleCauses": ["cause1", "cause2"],
  "medicineSuggestions": [{ "name": "Medicine name", "note": "Usage note and disclaimer" }],
  "healthTips": ["tip1", "tip2"],
  "urgency": "low|medium|high",
  "recommendedSpecialty": "Specialty name e.g. General Physician, Dermatologist"
}`;

function parseAIJson(text: string): {
  reply?: string;
  possibleCauses?: string[];
  medicineSuggestions?: { name: string; note: string }[];
  healthTips?: string[];
  urgency?: 'low' | 'medium' | 'high';
  recommendedSpecialty?: string;
} | null {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function fallbackResponse(userMessage: string): AIResponse {
  return {
    reply: `Thank you for sharing your symptoms regarding "${userMessage.slice(0, 100)}". I'm unable to connect to the AI service right now. Please consult a healthcare professional for proper evaluation. In case of emergency symptoms like chest pain or difficulty breathing, seek immediate medical care.`,
    metadata: {
      healthTips: ['Stay hydrated', 'Get adequate rest', 'Monitor your symptoms'],
      urgency: 'medium',
      recommendedSpecialty: 'General Physician',
    },
  };
}

export async function generateMedicalResponse(
  chatId: string,
  userMessage: string
): Promise<AIResponse> {
  const useN8n = process.env.USE_N8N === 'true';
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!useN8n && (!apiKey || apiKey === 'your_gemini_api_key_here')) {
    const doctors = await findDoctorsBySymptom(userMessage);
    const fallback = fallbackResponse(userMessage);
    fallback.metadata.doctors = doctors.map((d) => ({
      _id: d._id?.toString(),
      name: d.name,
      specialty: d.specialty,
      location: d.location,
      rating: d.rating,
      contact: d.contact,
    }));
    return fallback;
  }

  const history = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  if (useN8n && n8nWebhookUrl) {
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          userMessage,
          history: history.reverse(),
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook failed with status ${response.status}`);
      }

      const text = await response.text();
      const parsed = parseAIJson(text);

      if (!parsed?.reply) {
        return {
          reply: text,
          metadata: { urgency: 'low' },
        };
      }

      const metadata: IMessageMetadata = {
        possibleCauses: parsed.possibleCauses,
        medicineSuggestions: parsed.medicineSuggestions,
        healthTips: parsed.healthTips,
        urgency: parsed.urgency || 'low',
        recommendedSpecialty: parsed.recommendedSpecialty,
      };

      const specialty = metadata.recommendedSpecialty || '';
      const doctors = specialty
        ? await findDoctorsBySpecialty(specialty)
        : await findDoctorsBySymptom(userMessage, specialty);

      metadata.doctors = doctors.map((d) => ({
        _id: d._id?.toString(),
        name: d.name,
        specialty: d.specialty,
        location: d.location,
        rating: d.rating,
        contact: d.contact,
      }));

      return {
        reply: parsed.reply,
        metadata,
      };
    } catch (error) {
      console.error('n8n generation error:', error);
      const doctors = await findDoctorsBySymptom(userMessage);
      const fallback = fallbackResponse(userMessage);
      fallback.metadata.doctors = doctors.map((d) => ({
        _id: d._id?.toString(),
        name: d.name,
        specialty: d.specialty,
        location: d.location,
        rating: d.rating,
        contact: d.contact,
      }));
      return fallback;
    }
  }

  const conversation = history
    .reverse()
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const genAI = new GoogleGenerativeAI(apiKey!);
  const model = genAI.getGenerativeModel({
    model: process.env.AI_MODEL || 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const prompt = conversation
    ? `Previous conversation:\n${conversation}\n\nUser's latest message: ${userMessage}`
    : `User's message: ${userMessage}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJson(text);

    if (!parsed?.reply) {
      return {
        reply: text,
        metadata: { urgency: 'low' },
      };
    }

    const metadata: IMessageMetadata = {
      possibleCauses: parsed.possibleCauses,
      medicineSuggestions: parsed.medicineSuggestions,
      healthTips: parsed.healthTips,
      urgency: parsed.urgency || 'low',
      recommendedSpecialty: parsed.recommendedSpecialty,
    };

    const specialty = metadata.recommendedSpecialty || '';
    const doctors = specialty
      ? await findDoctorsBySpecialty(specialty)
      : await findDoctorsBySymptom(userMessage, specialty);

    metadata.doctors = doctors.map((d) => ({
      _id: d._id?.toString(),
      name: d.name,
      specialty: d.specialty,
      location: d.location,
      rating: d.rating,
      contact: d.contact,
    }));

    return {
      reply: parsed.reply,
      metadata,
    };
  } catch (error) {
    console.error('AI generation error:', error);
    const doctors = await findDoctorsBySymptom(userMessage);
    const fallback = fallbackResponse(userMessage);
    fallback.metadata.doctors = doctors.map((d) => ({
      _id: d._id?.toString(),
      name: d.name,
      specialty: d.specialty,
      location: d.location,
      rating: d.rating,
      contact: d.contact,
    }));
    return fallback;
  }
}
