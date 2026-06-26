import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message, DoctorRecommendation } from '../types';
import MedicineCard from './MedicineCard';
import DoctorCard from './DoctorCard';
import HealthTips from './HealthTips';
import DoctorModal from './DoctorModal';

interface ChatBubbleProps {
  message: Message;
}

const urgencyStyles = {
  low: 'border-l-medical-500',
  medium: 'border-l-amber-500',
  high: 'border-l-red-500',
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecommendation | null>(null);
  const isUser = message.role === 'user';
  const urgency = message.metadata?.urgency;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="max-w-[80%] rounded-2xl rounded-br-md bg-primary-600 px-4 py-3 text-white shadow-sm"
        >
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 max-w-sm overflow-hidden rounded-lg border border-primary-400 bg-primary-700/50">
              {message.attachments[0].type.startsWith('image/') ? (
                <img src={message.attachments[0].data} alt="Attachment" className="h-auto w-full max-h-64 object-contain" />
              ) : (
                <div className="p-3 text-sm font-medium">📄 {message.attachments[0].name}</div>
              )}
            </div>
          )}
          <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10, originX: 0, originY: 1 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`max-w-[85%] rounded-2xl rounded-bl-md border-l-4 bg-white px-4 py-3 shadow-sm dark:bg-slate-800 ${
          urgency ? urgencyStyles[urgency] : 'border-l-primary-400'
        }`}
      >
        {urgency === 'high' && (
          <div className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Urgent: Please seek immediate medical attention if symptoms are severe.
          </div>
        )}
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-slate-700 dark:prose-invert dark:text-slate-200">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>

        {message.metadata?.possibleCauses && message.metadata.possibleCauses.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Possible causes
            </p>
            <ul className="mt-1 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
              {message.metadata.possibleCauses.map((cause) => (
                <li key={cause}>{cause}</li>
              ))}
            </ul>
          </div>
        )}

        {message.metadata?.medicineSuggestions && message.metadata.medicineSuggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Recommended doctors
            </p>
            {message.metadata.doctors.map((doctor) => (
              <DoctorCard 
                key={doctor._id || doctor.name} 
                doctor={doctor} 
                onClick={() => setSelectedDoctor(doctor)}
              />
            ))}
            
            <DoctorModal 
              doctor={selectedDoctor} 
              onClose={() => setSelectedDoctor(null)} 
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
