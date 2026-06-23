import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { appointmentApi } from '../services/api';
import type { DoctorRecommendation } from '../types';

interface DoctorModalProps {
  doctor: DoctorRecommendation | null;
  onClose: () => void;
}

export default function DoctorModal({ doctor, onClose }: DoctorModalProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [doctor]);

  if (!doctor) return null;

  const handleBook = async () => {
    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }
    try {
      setLoading(true);
      await appointmentApi.book({
        doctorId: doctor._id!,
        date,
        time,
      });
      setStep(2);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to book appointment';
      toast.error(message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(0);
    setDate('');
    setTime('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-slate-800 animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute right-4 top-4 z-20 flex gap-2">
          {step === 1 && (
            <button 
              onClick={() => setStep(0)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-slate-500 backdrop-blur-md transition hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button 
            onClick={resetAndClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-slate-500 backdrop-blur-md transition hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="relative h-48 bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="absolute -bottom-16 left-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl dark:border-slate-900 dark:bg-slate-800">
            <span className="text-5xl">👨‍⚕️</span>
          </div>
        </div>

        <div className="px-8 pb-8 pt-20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{doctor.name}</h2>
              <p className="mt-1 text-lg font-medium text-primary-600 dark:text-primary-400">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              ⭐ {doctor.rating.toFixed(1)} Rating
            </div>
          </div>

          {step === 0 && (
            <>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Location & Contact</h4>
                <div className="mt-2 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800 text-primary-600 dark:text-primary-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="mt-1 leading-relaxed">{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800 text-primary-600 dark:text-primary-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span>{doctor.contact}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Availability</h4>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Available Today (10 AM - 6 PM)
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">About Doctor</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {doctor.about || `${doctor.name} is a highly respected ${doctor.specialty} based in Jamshedpur.`}
              </p>
              
              <div className="mt-6 flex gap-3">
                <div className="flex-1 rounded-xl bg-primary-50 p-3 text-center dark:bg-primary-900/20">
                  <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{doctor.experienceYears || 0}+</div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Years Exp.</div>
                </div>
                <div className="flex-1 rounded-xl bg-primary-50 p-3 text-center dark:bg-primary-900/20">
                  <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{(doctor.patientsCount && doctor.patientsCount >= 1000) ? `${(doctor.patientsCount / 1000).toFixed(1)}k+` : (doctor.patientsCount || 0)}</div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Patients</div>
                </div>
              </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  ₹{doctor.fee || 500} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ consultation</span>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="rounded-xl bg-primary-600 px-8 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-primary-600/40 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  Book Appointment
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="mt-8 animate-in slide-in-from-right-8 duration-300">
              <h3 className="mb-6 text-xl font-semibold text-slate-800 dark:text-white">Select Date & Time</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Consultation Date</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Consultation Time</label>
                  <input 
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-primary-900"
                  />
                </div>
                
                <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Consultation Fee</span>
                    <span className="font-bold text-primary-700 dark:text-primary-400">₹{doctor.fee || 500}</span>
                  </div>
                </div>

                <button 
                  onClick={handleBook}
                  disabled={loading}
                  className="w-full rounded-xl bg-primary-600 px-4 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-primary-600/40 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:opacity-50"
                >
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 flex flex-col items-center py-8 text-center animate-in zoom-in-95 duration-500">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Booking Confirmed!</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Your appointment with {doctor.name} is scheduled for {date} at {time}.
              </p>
              <button 
                onClick={resetAndClose}
                className="mt-8 rounded-xl bg-slate-100 px-8 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
