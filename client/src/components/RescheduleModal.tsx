import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, addDays, isSameDay } from 'date-fns';
import { CalendarCheck, Clock, CheckCircle2, X } from 'lucide-react';
import { appointmentApi } from '../services/api';

interface RescheduleModalProps {
  appointmentId: string | null;
  onClose: (didReschedule?: boolean) => void;
}

export default function RescheduleModal({ appointmentId, onClose }: RescheduleModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [appointmentId]);

  if (!appointmentId) return null;

  const upcomingDates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }
    try {
      setLoading(true);
      await appointmentApi.reschedule(appointmentId, {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
      });
      setStep(2);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to reschedule appointment';
      toast.error(message || 'Failed to reschedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = (didReschedule = false) => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    onClose(didReschedule);
  };

  return (
    <AnimatePresence>
      {appointmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => resetAndClose(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-slate-800"
          >
            <div className="absolute right-4 top-4 z-20 flex gap-2">
              <button 
                onClick={() => resetAndClose(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-8 pb-8 pt-12 max-h-[90vh] overflow-y-auto">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="mb-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Reschedule Appointment</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Choose a new date and time for your consultation.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                      <CalendarCheck className="h-5 w-5 text-primary-500" /> Select Date
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x custom-scrollbar">
                      {upcomingDates.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(d)}
                          className={`snap-start flex min-w-[80px] shrink-0 flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all ${
                            selectedDate && isSameDay(selectedDate, d)
                              ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10 dark:border-primary-500 dark:bg-primary-900/20'
                              : 'border-slate-100 bg-white hover:border-primary-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                          }`}
                        >
                          <span className={`text-xs font-bold uppercase ${selectedDate && isSameDay(selectedDate, d) ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
                            {format(d, 'MMM')}
                          </span>
                          <span className={`my-1 text-2xl font-black ${selectedDate && isSameDay(selectedDate, d) ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-200'}`}>
                            {format(d, 'dd')}
                          </span>
                          <span className={`text-xs font-bold ${selectedDate && isSameDay(selectedDate, d) ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
                            {format(d, 'EEE')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="overflow-hidden"
                      >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                          <Clock className="h-5 w-5 text-primary-500" /> Select Time
                        </h3>
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                                selectedTime === time
                                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-500/10 dark:border-primary-500 dark:bg-primary-900/30 dark:text-primary-300'
                                  : 'border-slate-100 bg-white text-slate-600 hover:border-primary-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={handleReschedule}
                      disabled={loading || !selectedDate || !selectedTime}
                      className="w-full rounded-2xl bg-primary-600 px-4 py-4 text-base font-bold tracking-wide text-white shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1 hover:bg-primary-700 hover:shadow-primary-600/40 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {loading ? 'Rescheduling...' : 'Confirm New Time'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, delay: 0.1 }}
                    className="mb-6 rounded-full bg-green-100 p-4 dark:bg-green-900/30"
                  >
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Rescheduled!</h3>
                  <div className="mt-4 rounded-2xl bg-slate-50 p-6 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                    <p className="text-slate-600 dark:text-slate-300 text-lg">
                      Your appointment is now scheduled for:
                    </p>
                    <div className="mt-4 text-2xl font-black text-primary-600 dark:text-primary-400">
                      {selectedDate && format(selectedDate, 'MMM do, yyyy')} at {selectedTime}
                    </div>
                  </div>
                  <button 
                    onClick={() => resetAndClose(true)}
                    className="mt-8 rounded-2xl bg-slate-900 px-10 py-4 text-sm font-bold text-white transition hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
