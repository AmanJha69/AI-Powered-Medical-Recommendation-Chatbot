import { Request, Response } from 'express';
import { findDoctorsBySymptom } from '../services/doctorService';
import { Doctor } from '../models/Doctor';

export async function listDoctors(req: Request, res: Response): Promise<void> {
  const symptom = (req.query.symptom as string) || '';
  if (symptom) {
    const doctors = await findDoctorsBySymptom(symptom);
    res.json(doctors);
  } else {
    const doctors = await Doctor.find().sort({ rating: -1 }).lean();
    res.json(doctors);
  }
}
