export interface User {
  id: string;
  name: string;
  email: string;
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
}

export interface MessageMetadata {
  possibleCauses?: string[];
  medicineSuggestions?: MedicineSuggestion[];
  healthTips?: string[];
  urgency?: 'low' | 'medium' | 'high';
  recommendedSpecialty?: string;
  doctors?: DoctorRecommendation[];
}

export interface Message {
  _id: string;
  chatId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
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
