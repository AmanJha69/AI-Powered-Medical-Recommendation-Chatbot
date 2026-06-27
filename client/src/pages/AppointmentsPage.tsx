import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, ArrowLeft, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { appointmentApi } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import RescheduleModal from '../components/RescheduleModal';
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
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await appointmentApi.cancel(id);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch {
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 relative overflow-hidden"
    >
      <div className="fixed -left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply dark:bg-primary-900/20 dark:mix-blend-color pointer-events-none"></div>
      <div className="fixed -right-[20%] bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[120px] mix-blend-multiply dark:bg-indigo-900/20 dark:mix-blend-color pointer-events-none"></div>
      
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">My Appointments</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Consultations</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">Manage your upcoming and past medical appointments securely.</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-loader h-48 rounded-3xl"></div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-12 rounded-[2rem] border border-slate-200 bg-white/50 p-12 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-primary-500 dark:bg-primary-900/30">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">No Appointments Yet</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">You haven't booked any consultations with our doctors yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 rounded-2xl bg-primary-600 px-8 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-primary-600/40"
            >
              Book an Appointment
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {appointments.map((apt, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={apt._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none relative"
                >
                  <div className="absolute top-0 right-0 h-full w-2 bg-primary-500"></div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex flex-1 flex-col justify-between p-8">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            apt.status === 'cancelled' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {apt.status === 'cancelled' ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            {apt.status}
                          </span>
                          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-6 flex items-start gap-5">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shrink-0">
                            <Calendar className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{apt.doctorId?.name || 'Unknown Doctor'}</h3>
                            <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">{apt.doctorId?.specialty || 'General'}</p>
                          </div>
                        </div>
                        
                        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2 font-medium">
                            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                              <MapPin className="h-4 w-4 text-slate-500" />
                            </div>
                            {apt.doctorId?.location || 'Clinic'}
                          </div>
                          <div className="flex items-center gap-2 font-medium">
                            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                              <Phone className="h-4 w-4 text-slate-500" />
                            </div>
                            {apt.doctorId?.contact || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center border-t border-slate-100 bg-slate-50 p-8 sm:w-72 sm:border-l sm:border-t-0 dark:border-slate-800 dark:bg-slate-800/50">
                      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                          <Clock className="h-4 w-4 text-primary-500" /> Date & Time
                        </div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">
                          {apt.date}
                        </div>
                        <div className="text-md font-bold text-primary-600 dark:text-primary-400 mt-1">
                          {apt.time}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between px-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Consultation Fee</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">₹{apt.doctorId?.fee || 500}</div>
                      </div>
                      
                      <div className="mt-6 flex flex-col gap-3">
                        {apt.status !== 'cancelled' && (
                          <button 
                            onClick={() => setRescheduleId(apt._id)}
                            className="w-full rounded-xl border-2 border-slate-200 bg-transparent py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                          >
                            Reschedule
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancel(apt._id)}
                            className="w-full rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <RescheduleModal 
        appointmentId={rescheduleId} 
        onClose={(didReschedule) => {
          setRescheduleId(null);
          if (didReschedule) {
            fetchAppointments();
          }
        }} 
      />
    </motion.div>
  );
}
