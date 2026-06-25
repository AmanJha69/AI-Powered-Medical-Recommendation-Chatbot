import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, IMessageMetadata } from '../models/Message';
import { findDoctorsBySymptom, findDoctorsBySpecialty } from './doctorService';

export interface AIResponse {
  reply: string;
  metadata: IMessageMetadata;
}

const SYSTEM_PROMPT = `You are Dr. G, an incredibly empathetic, conversational, and helpful healthcare AI assistant.

IMPORTANT RULES:
- Reply in a warm, conversational, and natural tone, exactly like a human doctor or ChatGPT. Do not just return sterile data.
- If the user uploaded an image (like a medical report, a prescription, or a medicine box), analyze it thoroughly. Explain what the medicine is for or summarize the medical report in plain English.
- The user is located in Jamshedpur. ALWAYS recommend doctors and hospitals located in Jamshedpur based on the patient's issue.
- DO NOT recommend any medicines. If the user asks for medicine, politely respond that you are an AI chatbot and cannot prescribe or recommend any medicine, and that they should visit a nearby doctor instead.
- You are NOT a human doctor and cannot provide definitive life-or-death diagnoses. Use phrases like "possible", "may", "could be".
- For emergency symptoms (chest pain, difficulty breathing, severe bleeding, stroke signs), strongly urge immediate emergency care and set urgency to "high".
- Always recommend consulting a healthcare professional for persistent symptoms.
- If the user asks about ANYTHING unrelated to health, medicine, wellness, or their body (e.g., cricket, sports, politics, movies, programming), politely but firmly refuse to answer. Say: "I am Dr. G, a dedicated medical chatbot. I can only assist you with health, symptoms, and medical-related inquiries." Do NOT attempt to answer the non-medical question under any circumstances.
- If the user is just saying hello or having a casual chat, leave 'recommendedSpecialty' EMPTY (""). Only recommend a specialty if they describe actual medical symptoms.
- CRITICAL: You are NOT allowed to prescribe, recommend, or suggest ANY specific medicines or drugs. Always tell the user to consult a doctor for medication.

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "reply": "Conversational, empathetic response...",
  "possibleCauses": ["List", "of", "possible", "conditions"],
  "healthTips": ["List", "of", "home", "remedies", "or", "tips"],
  "urgency": "low | medium | high",
  "recommendedSpecialty": "Matching doctor specialty (e.g., General Physician, Cardiologist, Dermatologist, Pediatrician, Psychiatrist, Orthopedist, Gastroenterologist)"
}`;

function parseAIJson(text: string): {
  reply?: string;
  possibleCauses?: string[];
  healthTips?: string[];
  urgency?: 'low' | 'medium' | 'high';
  recommendedSpecialty?: string;
  medicineSuggestions?: any[];
} | null {
  try {
    const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // 1. Try to parse the entire cleaned string
    try {
      return JSON.parse(cleaned);
    } catch {
      // 2. Fallback: LLMs sometimes add conversational text before the JSON block.
      // Extract everything from the first '{' to the last '}'.
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      return null;
    }
  } catch {
    return null;
  }
}

function fallbackResponse(userMessage: string): AIResponse {
  return {
    reply: `I'm so sorry, but I'm having trouble connecting to my AI core right now. Please consult a healthcare professional for a proper evaluation. If you are experiencing emergency symptoms like severe chest pain or difficulty breathing, please seek immediate medical care.`,
    metadata: {
      healthTips: ['Stay hydrated', 'Get adequate rest', 'Monitor your symptoms closely'],
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

  // --- START OF CACHE LOGIC ---
  try {
    const cleanedMessage = userMessage.trim();
    // Only cache if the message is substantial enough (avoid caching 'hi' or single words blindly if needed, but for now we cache all)
    // Find matching user messages. The first one will always be the one we JUST inserted in chatController,
    // so we need to grab the second most recent one.
    const cachedUserMessages = await Message.find({
      chatId, // Restrict to the current chat session to avoid context leakage!
      content: { $regex: new RegExp(`^${cleanedMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      role: 'user'
    }).sort({ createdAt: -1 }).limit(2).lean();

    const olderUserMessage = cachedUserMessages.length > 1 ? cachedUserMessages[1] : null;

    if (olderUserMessage && olderUserMessage.chatId) {
      const cachedAssistantMessage = await Message.findOne({
        chatId: olderUserMessage.chatId,
        role: 'assistant',
        createdAt: { $gt: olderUserMessage.createdAt }
      }).sort({ createdAt: 1 }).lean();

      if (cachedAssistantMessage && cachedAssistantMessage.content) {
        console.log(`⚡ CACHE HIT: Returning cached response for "${cleanedMessage}"`);
        return {
          reply: cachedAssistantMessage.content,
          metadata: cachedAssistantMessage.metadata as IMessageMetadata || { urgency: 'low' }
        };
      }
    }
  } catch (error) {
    console.error('Cache lookup error:', error);
  }
  // --- END OF CACHE LOGIC ---

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
      let doctors: any[] = [];
      
      // Only fetch doctors if the AI explicitly recommends a specialty OR it's not a casual greeting (determined by urgency or causes)
      if (specialty || (metadata.possibleCauses && metadata.possibleCauses.length > 0)) {
        doctors = specialty
          ? await findDoctorsBySpecialty(specialty)
          : await findDoctorsBySymptom(userMessage, specialty);
      }

      if (doctors.length > 0) {
        metadata.doctors = doctors.map((d) => ({
          _id: d._id?.toString(),
          name: d.name,
          specialty: d.specialty,
          location: d.location,
          rating: d.rating,
          contact: d.contact,
        }));
      }

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
    .map((m) => `${m.role === 'user' ? 'User' : 'Dr. G'}: ${m.content}`)
    .join('\n');

  const genAI = new GoogleGenerativeAI(apiKey || '');
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
