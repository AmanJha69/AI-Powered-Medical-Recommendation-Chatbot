import type { Message } from '../types';
import MedicineCard from './MedicineCard';
import DoctorCard from './DoctorCard';
import HealthTips from './HealthTips';

interface ChatBubbleProps {
  message: Message;
}

const urgencyStyles = {
  low: 'border-l-medical-500',
  medium: 'border-l-amber-500',
  high: 'border-l-red-500',
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const urgency = message.metadata?.urgency;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary-600 px-4 py-3 text-white shadow-sm">
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[85%] rounded-2xl rounded-bl-md border-l-4 bg-white px-4 py-3 shadow-sm ${
          urgency ? urgencyStyles[urgency] : 'border-l-primary-400'
        }`}
      >
        {urgency === 'high' && (
          <div className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Urgent: Please seek immediate medical attention if symptoms are severe.
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm text-slate-700">{message.content}</p>

        {message.metadata?.possibleCauses && message.metadata.possibleCauses.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Possible causes
            </p>
            <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
              {message.metadata.possibleCauses.map((cause) => (
                <li key={cause}>{cause}</li>
              ))}
            </ul>
          </div>
        )}

        {message.metadata?.medicineSuggestions && message.metadata.medicineSuggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Medicine suggestions (OTC)
            </p>
            {message.metadata.medicineSuggestions.map((med) => (
              <MedicineCard key={med.name} medicine={med} />
            ))}
          </div>
        )}

        {message.metadata?.healthTips && message.metadata.healthTips.length > 0 && (
          <HealthTips tips={message.metadata.healthTips} />
        )}

        {message.metadata?.doctors && message.metadata.doctors.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recommended doctors
            </p>
            {message.metadata.doctors.map((doctor) => (
              <DoctorCard key={doctor._id || doctor.name} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
