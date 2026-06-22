import { Request, Response } from 'express';
import { findDoctorsBySymptom } from '../services/doctorService';

export async function listDoctors(req: Request, res: Response): Promise<void> {
  const symptom = (req.query.symptom as string) || '';
  const doctors = symptom
    ? await findDoctorsBySymptom(symptom)
    : await findDoctorsBySymptom('general');
  res.json(doctors);
}
