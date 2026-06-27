export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'doctor';
  doctorId?: string;
}

export interface MedicineSuggestion {
  name: string;
  note: string;
}

export interface DoctorRecommendation {
  _id?: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  contact: string;
  experienceYears?: number;
  patientsCount?: number;
  about?: string;
  fee?: number;
}

export interface MessageMetadata {
  possibleCauses?: string[];
  medicineSuggestions?: MedicineSuggestion[];
  healthTips?: string[];
  urgency?: 'low' | 'medium' | 'high';
  recommendedSpecialty?: string;
  doctors?: DoctorRecommendation[];
}

export interface Attachment {
  name: string;
  type: string;
  data: string; // Base64 encoded data
}

export interface Message {
  _id: string;
  chatId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: Attachment[];
  metadata?: MessageMetadata;
  createdAt: string;
}

export interface Chat {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
