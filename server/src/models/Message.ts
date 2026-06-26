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

export interface IAttachment {
  name: string;
  type: string;
  data: string; // Base64
}

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: IAttachment[];
  metadata?: IMessageMetadata;
  embedding?: number[];
  createdAt: Date;
}

const attachmentSchema = new Schema<IAttachment>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: String, required: true },
}, { _id: false });

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    attachments: [attachmentSchema],
    metadata: { type: Schema.Types.Mixed },
    embedding: { type: [Number], index: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ chatId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
