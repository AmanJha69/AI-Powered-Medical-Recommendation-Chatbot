const SYMPTOMS = ['Headache', 'Fever', 'Cough', 'Sore throat', 'Fatigue', 'Nausea', 'Back pain'];

interface SymptomChipsProps {
  onSelect: (symptom: string) => void;
  disabled?: boolean;
}

export default function SymptomChips({ onSelect, disabled }: SymptomChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SYMPTOMS.map((symptom) => (
        <button
          key={symptom}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(`I have ${symptom.toLowerCase()}`)}
          className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-sm text-primary-700 transition hover:bg-primary-50 disabled:opacity-50"
        >
          {symptom}
        </button>
      ))}
    </div>
  );
}
