import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'doctor';
  doctorId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'doctor'], default: 'user' },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
