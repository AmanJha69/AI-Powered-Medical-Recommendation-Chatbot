import { Doctor, IDoctor } from '../models/Doctor';

export async function findDoctorsBySymptom(
  symptom: string,
  specialty?: string
): Promise<IDoctor[]> {
  const query = symptom.trim().toLowerCase();
  const filter: Record<string, unknown> = {};

  if (specialty) {
    filter.specialty = new RegExp(specialty, 'i');
  }

  const doctors = await Doctor.find({
    ...filter,
    $or: [
      { symptomsKeywords: { $regex: query, $options: 'i' } },
      { specialty: { $regex: query, $options: 'i' } },
    ],
  })
    .limit(5)
    .lean();

  if (doctors.length > 0) return doctors as IDoctor[];

  return Doctor.find(filter).sort({ rating: -1 }).limit(3).lean() as Promise<IDoctor[]>;
}

export async function findDoctorsBySpecialty(specialty: string): Promise<IDoctor[]> {
  return Doctor.find({ specialty: new RegExp(specialty, 'i') })
    .sort({ rating: -1 })
    .limit(5)
    .lean() as Promise<IDoctor[]>;
}
