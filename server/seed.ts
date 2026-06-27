import { connectDB } from './src/config/db';
import { reseedDoctors } from './src/utils/doctorsData';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  await connectDB();
  await reseedDoctors();
  await mongoose.connection.close();
  console.log('Seeding complete.');
}
run();
