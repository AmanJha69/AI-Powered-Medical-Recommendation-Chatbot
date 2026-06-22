interface MedicineCardProps {
  medicine: { name: string; note: string };
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <div className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-2">
      <p className="text-sm font-medium text-primary-800">{medicine.name}</p>
      <p className="text-xs text-primary-600">{medicine.note}</p>
    </div>
  );
}
