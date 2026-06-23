import type { DoctorRecommendation } from '../types';

interface DoctorCardProps {
  doctor: DoctorRecommendation;
  onClick?: () => void;
}

export default function DoctorCard({ doctor, onClick }: DoctorCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 dark:border-slate-800/50 dark:bg-slate-900/80 dark:hover:border-primary-500/30"
    >
      {/* Decorative gradient blob on hover */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-10 dark:from-primary-500 dark:to-primary-800"></div>

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-slate-800 dark:text-primary-400 dark:group-hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            ⭐ {doctor.rating.toFixed(1)}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400">{doctor.name}</h3>
        <p className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400">{doctor.specialty}</p>
        
        <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
              <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="leading-relaxed">{doctor.location}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-slate-100 p-1 dark:bg-slate-800">
              <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span>{doctor.contact}</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation(); // don't trigger card click
          if (onClick) onClick();
        }}
        className="relative z-10 mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-primary-600/30 dark:bg-slate-800 dark:hover:bg-primary-600"
      >
        Book Appointment
      </button>
    </div>
  );
}
