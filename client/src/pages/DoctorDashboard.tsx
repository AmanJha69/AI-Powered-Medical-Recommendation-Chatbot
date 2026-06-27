import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doctorDashboardApi } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Appointment {
  _id: string;
  userId: { _id: string; name: string; email: string };
  date: string;
  time: string;
  symptoms: string[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const data = await doctorDashboardApi.getAppointments();
      setAppointments(data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await doctorDashboardApi.updateStatus(id, status);
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(a => a.date === todayDate).length;
  const pendingConsultations = appointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
        <img src="/pillio-bg.png" alt="abstract background" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-lighten" />
      </div>

      <nav className="relative z-10 glass-panel sticky top-4 mx-4 md:mx-auto max-w-7xl rounded-[32px] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-primary-600 text-white shadow-lg shadow-primary-500/30">
            <span className="text-2xl drop-shadow-sm">👨‍⚕️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Doctor Portal</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome, {user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={logout}
            className="flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl p-6 lg:p-8 mt-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-[32px] font-black tracking-tight">Your Schedule</h2>
            <p className="text-slate-500 font-medium mt-1">Manage your upcoming appointments and patient requests.</p>
          </div>
        </div>

        {!loading && (
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="pillio-card flex items-center gap-6 py-6 px-8 hover-magnetic">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-3xl dark:bg-primary-900/30 shadow-sm border border-primary-100 dark:border-primary-800">📅</div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Patients Today</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{todayAppointments}</p>
              </div>
            </div>
            <div className="pillio-card flex items-center gap-6 py-6 px-8 hover-magnetic">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl dark:bg-amber-900/30 shadow-sm border border-amber-100 dark:border-amber-800">⏳</div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{pendingConsultations}</p>
              </div>
            </div>
            <div className="pillio-card flex items-center gap-6 py-6 px-8 hover-magnetic">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-900/30 shadow-sm border border-emerald-100 dark:border-emerald-800">✅</div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{completedAppointments}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pillio-card h-64 skeleton-loader" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="pillio-card text-center py-20">
            <span className="text-5xl opacity-50 mb-4 block">📅</span>
            <h3 className="text-xl font-bold">No appointments yet</h3>
            <p className="text-slate-500 mt-2">You don't have any appointments scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {appointments.map((apt, index) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="pillio-card relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 w-full h-2 ${apt.status === 'confirmed' ? 'bg-primary-500' : apt.status === 'completed' ? 'bg-emerald-500' : apt.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        apt.status === 'confirmed' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' :
                        apt.status === 'completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
                        apt.status === 'cancelled' ? 'bg-red-50 text-red-600 dark:bg-red-900/30' :
                        'bg-amber-50 text-amber-600 dark:bg-amber-900/30'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black">{apt.time}</p>
                      <p className="text-sm font-medium text-slate-500">{format(new Date(apt.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <div className="bg-white dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className="font-bold">{apt.userId?.name || 'Unknown Patient'}</p>
                        <p className="text-xs font-medium text-slate-500">{apt.userId?.email || 'No email'}</p>
                      </div>
                    </div>

                    <div className="pl-2 border-l-2 border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Reported Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {apt.symptoms && apt.symptoms.length > 0 ? (
                          apt.symptoms.map((sym, i) => (
                            <span key={i} className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium dark:bg-slate-800 dark:border-slate-700">
                              {sym}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500 italic">None reported</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <div className="mt-8 flex gap-3">
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'completed')}
                        className="flex-1 rounded-full bg-emerald-500 text-white font-bold py-3 text-sm transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Complete
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
                        className="flex-1 rounded-full bg-white border-2 border-slate-100 text-slate-600 font-bold py-3 text-sm transition-all hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
