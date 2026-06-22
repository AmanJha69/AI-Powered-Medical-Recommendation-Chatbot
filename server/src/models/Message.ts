import mongoose, { Document, Schema, Types } from 'mongoose';

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

export interface IMessageMetadata {
  possibleCauses?: string[];
  medicineSuggestions?: MedicineSuggestion[];
  healthTips?: string[];
  urgency?: 'low' | 'medium' | 'high';
  recommendedSpecialty?: string;
  doctors?: DoctorRecommendation[];
}

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: IMessageMetadata;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ chatId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
