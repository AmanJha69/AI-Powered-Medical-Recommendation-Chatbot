import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define the schema here so the script can run independently
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  contact: { type: String, required: true },
  symptomsKeywords: { type: [String], default: [] },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the .env file.');
  process.exit(1);
}

const jamshedpurDoctors = [
  // General Physicians
  {
    name: "Dr. A.K. Singh",
    specialty: "General Physician",
    location: "Tata Main Hospital (TMH), Bistupur, Jamshedpur",
    rating: 4.8,
    contact: "+91-657-6641111",
    symptomsKeywords: ["fever", "cough", "cold", "flu", "weakness", "body ache", "headache", "viral", "infection"],
    experienceYears: 25,
    patientsCount: 15000,
    about: "Dr. A.K. Singh is a highly respected General Physician at Tata Main Hospital with over 25 years of experience in diagnosing and treating a wide range of medical conditions.",
    fee: 500
  },
  {
    name: "Dr. R.K. Agarwal",
    specialty: "General Physician",
    location: "Brahmananda Narayana Multispeciality Hospital, Tamolia, Jamshedpur",
    rating: 4.7,
    contact: "+91-1800-309-0309",
    symptomsKeywords: ["fever", "cough", "tiredness", "malaria", "dengue", "typhoid", "general checkup"],
    experienceYears: 18,
    patientsCount: 10000,
    about: "Dr. R.K. Agarwal specializes in infectious diseases and general wellness, offering comprehensive medical care and preventive health checkups.",
    fee: 600
  },

  // Cardiologists
  {
    name: "Dr. S.K. Mandal",
    specialty: "Cardiologist",
    location: "Medica Kantilal Gandhi Hospital, South Park, Bistupur, Jamshedpur",
    rating: 4.9,
    contact: "+91-657-6622000",
    symptomsKeywords: ["chest pain", "heart", "blood pressure", "palpitations", "shortness of breath", "bp", "heart attack"],
    experienceYears: 22,
    patientsCount: 8000,
    about: "Dr. S.K. Mandal is a leading Cardiologist known for his expertise in interventional cardiology and advanced heart failure management.",
    fee: 1000
  },
  {
    name: "Dr. N.N. Jha",
    specialty: "Cardiologist",
    location: "Tata Main Hospital (TMH), Bistupur, Jamshedpur",
    rating: 4.6,
    contact: "+91-657-6641111",
    symptomsKeywords: ["chest pain", "heart", "cholesterol", "dizziness", "irregular heartbeat"],
    experienceYears: 15,
    patientsCount: 6500,
    about: "Dr. N.N. Jha offers exceptional cardiac care, focusing on preventive cardiology, hypertension management, and echocardiography.",
    fee: 800
  },

  // Dermatologists
  {
    name: "Dr. Anjali Sharma",
    specialty: "Dermatologist",
    location: "Skin & Hair Clinic, Sakchi, Jamshedpur",
    rating: 4.8,
    contact: "+91-98350-12345",
    symptomsKeywords: ["acne", "rash", "pimples", "hair fall", "itching", "skin", "dandruff", "eczema", "allergy"],
    experienceYears: 12,
    patientsCount: 5000,
    about: "Dr. Anjali Sharma is a renowned Dermatologist specializing in cosmetic dermatology, acne treatments, and advanced hair restoration therapies.",
    fee: 600
  },
  {
    name: "Dr. Manish Kumar",
    specialty: "Dermatologist",
    location: "Steel City Clinic, Kadma, Jamshedpur",
    rating: 4.5,
    contact: "+91-94311-54321",
    symptomsKeywords: ["rash", "hives", "psoriasis", "warts", "skin infection", "burn"],
    experienceYears: 10,
    patientsCount: 4000,
    about: "Dr. Manish Kumar provides expert diagnosis and treatment for clinical skin conditions including psoriasis, eczema, and skin infections.",
    fee: 500
  },

  // Pediatricians
  {
    name: "Dr. V.P. Singh",
    specialty: "Pediatrician",
    location: "Child Care Hospital, Golmuri, Jamshedpur",
    rating: 4.9,
    contact: "+91-657-2345678",
    symptomsKeywords: ["child fever", "baby", "vaccination", "pediatric", "child cough", "stomach ache child", "crying"],
    experienceYears: 20,
    patientsCount: 12000,
    about: "Dr. V.P. Singh is a compassionate Pediatrician dedicated to providing holistic healthcare for infants, children, and adolescents.",
    fee: 600
  },
  {
    name: "Dr. Sneha Verma",
    specialty: "Pediatrician",
    location: "Tata Motors Hospital, Telco Colony, Jamshedpur",
    rating: 4.7,
    contact: "+91-657-2281111",
    symptomsKeywords: ["toddler", "infant", "child growth", "baby rash", "child vomiting", "diarrhea child"],
    experienceYears: 14,
    patientsCount: 7500,
    about: "Dr. Sneha Verma specializes in pediatric nutrition, early childhood development, and routine immunizations.",
    fee: 550
  },

  // Psychiatrists
  {
    name: "Dr. Deepak Prasad",
    specialty: "Psychiatrist",
    location: "Mind Care Clinic, Bistupur, Jamshedpur",
    rating: 4.8,
    contact: "+91-99551-98765",
    symptomsKeywords: ["stress", "anxiety", "depression", "sleep", "insomnia", "panic", "mental health", "sadness"],
    experienceYears: 16,
    patientsCount: 4500,
    about: "Dr. Deepak Prasad is a highly trained Psychiatrist offering therapy and medical management for depression, anxiety disorders, and stress-related conditions.",
    fee: 800
  },

  // Orthopedics
  {
    name: "Dr. Ravi Ranjan",
    specialty: "Orthopedic",
    location: "Tinplate Hospital, Golmuri, Jamshedpur",
    rating: 4.6,
    contact: "+91-657-2341234",
    symptomsKeywords: ["bone pain", "fracture", "joint pain", "knee pain", "back pain", "arthritis", "sprain"],
    experienceYears: 19,
    patientsCount: 9000,
    about: "Dr. Ravi Ranjan is an expert in joint replacement surgeries, trauma care, and sports medicine.",
    fee: 700
  },
  {
    name: "Dr. A. Bera",
    specialty: "Orthopedic",
    location: "Tata Main Hospital (TMH), Bistupur, Jamshedpur",
    rating: 4.7,
    contact: "+91-657-6641111",
    symptomsKeywords: ["shoulder pain", "neck pain", "muscle tear", "orthopedic", "spine"],
    experienceYears: 21,
    patientsCount: 11000,
    about: "Dr. A. Bera specializes in spine surgeries and complex orthopedic trauma, bringing decades of experience from TMH.",
    fee: 800
  },

  // Gastroenterologists
  {
    name: "Dr. M.K. Mishra",
    specialty: "Gastroenterologist",
    location: "Medica Kantilal Gandhi Hospital, Bistupur, Jamshedpur",
    rating: 4.8,
    contact: "+91-657-6622000",
    symptomsKeywords: ["stomach ache", "acidity", "gas", "digestion", "vomiting", "diarrhea", "ulcer", "liver"],
    experienceYears: 17,
    patientsCount: 8500,
    about: "Dr. M.K. Mishra is a top-tier Gastroenterologist treating complex digestive tract disorders, liver diseases, and offering advanced endoscopy services.",
    fee: 900
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected successfully.');

    console.log('Clearing old doctors...');
    await Doctor.deleteMany({});
    
    console.log(`Inserting ${jamshedpurDoctors.length} doctors from Jamshedpur...`);
    await Doctor.insertMany(jamshedpurDoctors);
    
    console.log('Dummy data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
