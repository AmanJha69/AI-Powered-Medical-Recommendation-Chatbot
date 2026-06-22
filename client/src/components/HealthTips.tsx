interface HealthTipsProps {
  tips: string[];
}

export default function HealthTips({ tips }: HealthTipsProps) {
  return (
    <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Health tips</p>
      <ul className="mt-1 space-y-1">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="text-medical-500">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
