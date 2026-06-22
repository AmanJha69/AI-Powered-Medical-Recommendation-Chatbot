import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { reseedDoctors } from './doctorsData';

dotenv.config();

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical-chatbot';
  await mongoose.connect(uri);
  await reseedDoctors();
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
