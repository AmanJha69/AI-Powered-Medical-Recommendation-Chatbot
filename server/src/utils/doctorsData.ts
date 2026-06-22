import { Doctor } from '../models/Doctor';

export const doctorsSeedData = [
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
  },
];

export async function seedDoctorsIfEmpty(): Promise<void> {
  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany(doctorsSeedData);
    console.log(`Auto-seeded ${doctorsSeedData.length} doctors`);
  }
}

export async function reseedDoctors(): Promise<void> {
  await Doctor.deleteMany({});
  await Doctor.insertMany(doctorsSeedData);
  console.log(`Seeded ${doctorsSeedData.length} doctors`);
}
