import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'New chat', trim: true },
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, updatedAt: -1 });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
