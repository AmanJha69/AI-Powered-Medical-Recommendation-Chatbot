import { connectDB } from './src/config/db';
import { Doctor } from './src/models/Doctor';
import { User } from './src/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function addAmanJha() {
  await connectDB();

  const doctorData = {
    name: 'Dr. Aman Jha',
    specialty: 'Dermatologist',
    location: 'Skin Care & Dermatology, Main Hospital',
    rating: 5.0,
    contact: '+1-555-1234',
    symptomsKeywords: ['rash', 'acne', 'skin', 'itching', 'eczema', 'dermatitis', 'hair loss'],
    experienceYears: 10,
    patientsCount: 3000,
    about: 'Expert in clinical and cosmetic dermatology.',
    fee: 500
  };

  let doctor = await Doctor.findOne({ name: 'Dr. Aman Jha' });
  
  if (!doctor) {
    doctor = await Doctor.create(doctorData);
    console.log('Created Dr. Aman Jha profile.');
  } else {
    console.log('Dr. Aman Jha already exists.');
  }

  const email = 'dramanjha@example.com';
  const existingUser = await User.findOne({ email });
  
  if (!existingUser) {
    const passwordHash = await bcrypt.hash('password123', 12);
    await User.create({
      name: doctor.name,
      email,
      passwordHash,
      role: 'doctor',
      doctorId: doctor._id
    });
    console.log(`Created account for ${doctor.name} (${email})`);
  } else {
    console.log(`User account ${email} already exists.`);
  }

  process.exit(0);
}

addAmanJha();
