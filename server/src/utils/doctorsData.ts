import { Doctor } from '../models/Doctor';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export const doctorsSeedData = [
  {
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
  },
  {
    name: 'Dr. Sarah Mitchell',
    specialty: 'General Physician',
    location: 'City Medical Center, Downtown',
    rating: 4.8,
    contact: '+1-555-0101',
    symptomsKeywords: ['fever', 'headache', 'fatigue', 'cold', 'flu', 'general'],
  },
  {
    name: 'Dr. James Chen',
    specialty: 'Cardiologist',
    location: 'Heart Care Clinic, Westside',
    rating: 4.9,
    contact: '+1-555-0102',
    symptomsKeywords: ['chest pain', 'palpitations', 'heart', 'blood pressure'],
  },
  {
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    location: 'Skin Health Institute, North District',
    rating: 4.7,
    contact: '+1-555-0103',
    symptomsKeywords: ['rash', 'acne', 'skin', 'itching', 'eczema'],
  },
  {
    name: 'Dr. Michael Thompson',
    specialty: 'Pulmonologist',
    location: 'Respiratory Care Center, Eastside',
    rating: 4.8,
    contact: '+1-555-0104',
    symptomsKeywords: ['cough', 'breathing', 'asthma', 'shortness of breath', 'wheezing'],
  },
  {
    name: 'Dr. Lisa Park',
    specialty: 'Neurologist',
    location: 'Neuro Wellness Clinic, Central',
    rating: 4.9,
    contact: '+1-555-0105',
    symptomsKeywords: ['headache', 'migraine', 'dizziness', 'numbness', 'seizure'],
  },
  {
    name: 'Dr. Robert Williams',
    specialty: 'Orthopedist',
    location: 'Bone & Joint Hospital, South District',
    rating: 4.6,
    contact: '+1-555-0106',
    symptomsKeywords: ['joint pain', 'back pain', 'fracture', 'muscle', 'sprain'],
  },
  {
    name: 'Dr. Anita Sharma',
    specialty: 'Gastroenterologist',
    location: 'Digestive Health Center, Midtown',
    rating: 4.7,
    contact: '+1-555-0107',
    symptomsKeywords: ['stomach', 'nausea', 'diarrhea', 'abdominal', 'digestion'],
  },
  {
    name: 'Dr. David Kim',
    specialty: 'ENT Specialist',
    location: 'Ear Nose Throat Clinic, Uptown',
    rating: 4.5,
    contact: '+1-555-0108',
    symptomsKeywords: ['sore throat', 'ear pain', 'sinus', 'hearing', 'tonsil'],
  },
  {
    name: 'Dr. Maria Garcia',
    specialty: 'Pediatrician',
    location: "Children's Health Center, Family District",
    rating: 4.9,
    contact: '+1-555-0109',
    symptomsKeywords: ['child', 'pediatric', 'baby', 'infant', 'vaccination'],
  },
  {
    name: "Dr. Kevin O'Brien",
    specialty: 'Psychiatrist',
    location: 'Mental Wellness Center, Riverside',
    rating: 4.8,
    contact: '+1-555-0110',
    symptomsKeywords: ['anxiety', 'depression', 'stress', 'sleep', 'mental health'],
  },
  {
    name: 'Dr. Priya Patel',
    specialty: 'Endocrinologist',
    location: 'Hormone Health Clinic, Tech Park',
    rating: 4.7,
    contact: '+1-555-0111',
    symptomsKeywords: ['diabetes', 'thyroid', 'hormone', 'weight', 'fatigue'],
  },
  {
    name: 'Dr. John Anderson',
    specialty: 'Ophthalmologist',
    location: 'Vision Care Center, Mall Road',
    rating: 4.6,
    contact: '+1-555-0112',
    symptomsKeywords: ['eye', 'vision', 'blurry', 'red eye', 'conjunctivitis'],
    experienceYears: 18,
    patientsCount: 6000,
    about: 'Expert in vision correction and eye health.',
    fee: 600
  },
  {
    name: 'Dr. Rachel Green',
    specialty: 'Gynecologist',
    location: 'Women Health Clinic, Southville',
    rating: 4.8,
    contact: '+1-555-0113',
    symptomsKeywords: ['pregnancy', 'period', 'women', 'maternity', 'gynecology'],
    experienceYears: 12,
    patientsCount: 4500,
    about: 'Dedicated to providing comprehensive healthcare for women.',
    fee: 700
  },
  {
    name: 'Dr. Simon Cowell',
    specialty: 'Dentist',
    location: 'Smile Dental Care, Downtown',
    rating: 4.7,
    contact: '+1-555-0114',
    symptomsKeywords: ['tooth', 'toothache', 'dental', 'gums', 'cavity'],
    experienceYears: 8,
    patientsCount: 2000,
    about: 'Specializes in cosmetic dentistry and oral hygiene.',
    fee: 400
  },
  {
    name: 'Dr. Olivia Martinez',
    specialty: 'Urologist',
    location: 'Men & Women Urology, Central District',
    rating: 4.9,
    contact: '+1-555-0115',
    symptomsKeywords: ['kidney', 'urinary', 'bladder', 'prostate', 'urine'],
    experienceYears: 15,
    patientsCount: 5000,
    about: 'Providing advanced care for urinary tract issues.',
    fee: 800
  }
];

async function createAccountsForDoctors() {
  const doctors = await Doctor.find();
  const passwordHash = await bcrypt.hash('password123', 12);
  
  for (const doc of doctors) {
    const email = `${doc.name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({
        name: doc.name,
        email,
        passwordHash,
        role: 'doctor',
        doctorId: doc._id
      });
      console.log(`Created account for ${doc.name} (${email})`);
    }
  }
}

export async function seedDoctorsIfEmpty(): Promise<void> {
  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany(doctorsSeedData);
    console.log(`Auto-seeded ${doctorsSeedData.length} doctors`);
  }
  // Ensure all doctors have user accounts
  await createAccountsForDoctors();
}

export async function reseedDoctors(): Promise<void> {
  await Doctor.deleteMany({});
  await User.deleteMany({ role: 'doctor' });
  await Doctor.insertMany(doctorsSeedData);
  console.log(`Seeded ${doctorsSeedData.length} doctors`);
  await createAccountsForDoctors();
}
