import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  contact: string;
  symptomsKeywords: string[];
  experienceYears: number;
  patientsCount: number;
  about: string;
  fee: number;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  specialty: { type: String, required: true, index: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  contact: { type: String, required: true },
  symptomsKeywords: { type: [String], default: [] },
  experienceYears: { type: Number, default: 0 },
  patientsCount: { type: Number, default: 0 },
  about: { type: String, default: '' },
  fee: { type: Number, default: 500 },
});

doctorSchema.index({ specialty: 1 });
doctorSchema.index({ symptomsKeywords: 1 });

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);
