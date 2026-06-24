import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentApi } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import type { DoctorRecommendation } from '../types';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  doctorId: DoctorRecommendation;
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await appointmentApi.list();
        setAppointments(data);
      } catch {
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 relative overflow-hidden">
      <div className="fixed -left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply dark:bg-primary-900/20 dark:mix-blend-color pointer-events-none"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 glass-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">My Appointments</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Booking History</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">View and manage your upcoming and past consultations.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white/50 p-12 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-5xl dark:bg-primary-900/30">
              📅
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">No Appointments Yet</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">You haven't booked any consultations with our doctors yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 rounded-xl bg-primary-600 px-8 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-primary-600/40"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((apt) => (
              <div 
                key={apt._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Booked on {new Date(apt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{apt.doctorId?.name || 'Unknown Doctor'}</h3>
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{apt.doctorId?.specialty || 'General'}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {apt.doctorId?.location || 'Clinic'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {apt.doctorId?.contact || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center border-t border-slate-100 bg-slate-50 p-6 sm:w-64 sm:border-l sm:border-t-0 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="text-center">
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Date & Time</div>
                      <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                        {apt.date}
                      </div>
                      <div className="text-md font-medium text-primary-600 dark:text-primary-400">
                        {apt.time}
                      </div>
                      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <div className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Consultation Fee</div>
                        <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">₹{apt.doctorId?.fee || 500}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
