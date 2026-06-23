import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
