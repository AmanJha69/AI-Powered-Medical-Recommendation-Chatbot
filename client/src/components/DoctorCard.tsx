import type { DoctorRecommendation } from '../types';

interface DoctorCardProps {
  doctor: DoctorRecommendation;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="rounded-lg border border-medical-100 bg-medical-50 px-3 py-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-medical-700">{doctor.name}</p>
          <p className="text-xs text-medical-600">{doctor.specialty}</p>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-amber-600">
          ★ {doctor.rating}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{doctor.location}</p>
      <p className="text-xs text-primary-600">{doctor.contact}</p>
    </div>
  );
}
