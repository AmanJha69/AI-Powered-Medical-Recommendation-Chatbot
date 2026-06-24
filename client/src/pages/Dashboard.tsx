import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { doctorApi } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import DoctorCard from '../components/DoctorCard';
import DoctorModal from '../components/DoctorModal';
import ThemeToggle from '../components/ThemeToggle';
import type { DoctorRecommendation } from '../types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecommendation | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<{title: string, icon: string, description: string, details: string[], color?: string, hoverColor?: string} | null>(null);
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await doctorApi.list();
        setDoctors(data); // Store all doctors, we will slice later if needed
      } catch {
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const categories = [
    { name: 'General Physician', icon: '👨‍⚕️', color: 'bg-blue-100 text-blue-600' },
    { name: 'Cardiologist', icon: '❤️', color: 'bg-red-100 text-red-600' },
    { name: 'Dermatologist', icon: '🧴', color: 'bg-amber-100 text-amber-600' },
    { name: 'Pediatrician', icon: '👶', color: 'bg-green-100 text-green-600' },
    { name: 'Psychiatrist', icon: '🧠', color: 'bg-purple-100 text-purple-600' },
    { name: 'Orthopedist', icon: '🦴', color: 'bg-orange-100 text-orange-600' },
  ];

  const healthTipsData = [
    {
      title: 'Daily Exercise Routine',
      icon: '🏃‍♂️',
      color: 'from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50',
      hoverColor: 'hover:shadow-teal-500/10',
      description: 'Just 30 minutes of brisk walking every day can significantly improve your cardiovascular health and overall mood.',
      details: [
        'Improves cardiovascular health and lowers blood pressure.',
        'Boosts mental health by releasing endorphins.',
        'Helps maintain a healthy weight and builds muscle strength.',
        'Improves sleep quality and duration.',
        'Tip: Start with 15 minutes a day and gradually increase your time.'
      ]
    },
    {
      title: 'Balanced Diet Basics',
      icon: '🥗',
      color: 'from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50',
      hoverColor: 'hover:shadow-amber-500/10',
      description: 'Incorporate more leafy greens and lean proteins into your meals to boost your energy levels and immune system.',
      details: [
        'Ensures your body gets essential vitamins and minerals.',
        'Lean proteins aid in muscle repair and growth.',
        'Leafy greens provide antioxidants and fiber for digestion.',
        'Helps prevent chronic diseases like diabetes and heart disease.',
        'Tip: Try to fill half your plate with vegetables at every meal.'
      ]
    },
    {
      title: 'Prioritize Mental Health',
      icon: '🧘‍♀️',
      color: 'from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50',
      hoverColor: 'hover:shadow-purple-500/10',
      description: 'Taking care of your mind is just as important as your body. Manage stress and take breaks.',
      details: [
        'Reduces the risk of burnout and chronic stress.',
        'Meditation and deep breathing lower cortisol levels.',
        'Improves focus, productivity, and emotional regulation.',
        'Fosters better relationships and communication.',
        'Tip: Spend 10 minutes unplugged from screens each morning.'
      ]
    },
    {
      title: 'Proper Sleep Hygiene',
      icon: '💤',
      color: 'from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50',
      hoverColor: 'hover:shadow-indigo-500/10',
      description: 'A good night\'s sleep is the foundation of excellent health. Aim for 7-9 hours per night.',
      details: [
        'Enhances memory consolidation and cognitive function.',
        'Allows your body time to repair tissues and muscles.',
        'Regulates hormones related to hunger and appetite.',
        'Strengthens the immune system against infections.',
        'Tip: Avoid caffeine and heavy meals 3 hours before bed.'
      ]
    },
    {
      title: 'Stay Hydrated',
      icon: '💧',
      color: 'from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50',
      hoverColor: 'hover:shadow-blue-500/10',
      description: 'Drinking enough water daily is crucial for many of your body\'s fundamental processes.',
      details: [
        'Maintains body temperature and lubricates joints.',
        'Helps transport nutrients and oxygen to your cells.',
        'Flushes out waste products and supports kidney function.',
        'Keeps your skin looking healthy and radiant.',
        'Tip: Carry a reusable water bottle to remind you to drink.'
      ]
    },
    {
      title: 'Routine Checkups',
      icon: '🩺',
      color: 'from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/50',
      hoverColor: 'hover:shadow-rose-500/10',
      description: 'Don\'t wait until you\'re sick! Regular screenings can catch problems before they start.',
      details: [
        'Early detection often leads to much better treatment outcomes.',
        'Keeps your vaccinations and immunizations up to date.',
        'Provides an opportunity to discuss lifestyle changes with a pro.',
        'Monitors important baselines like blood pressure and cholesterol.',
        'Tip: Schedule an annual physical with a General Physician.'
      ]
    }
  ];


  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Background blobs for overall page depth */}
      <div className="fixed -left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply dark:bg-primary-900/20 dark:mix-blend-color pointer-events-none"></div>
      <div className="fixed -right-[20%] top-[40%] h-[600px] w-[600px] rounded-full bg-amber-400/20 blur-[120px] mix-blend-multiply dark:bg-amber-900/20 dark:mix-blend-color pointer-events-none"></div>

      <DisclaimerBanner />
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 glass-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30 dark:from-primary-600 dark:to-primary-800">
              <span className="text-2xl font-bold">+</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dr. G</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden text-sm font-medium text-slate-600 dark:text-slate-300 sm:block">
              Welcome, <span className="font-bold text-primary-600 dark:text-primary-400">{user?.name}</span>
            </span>
            <button
              onClick={() => navigate('/appointments')}
              className="rounded-xl border border-primary-200 bg-primary-50 px-5 py-2.5 text-sm font-bold text-primary-700 shadow-sm transition-all hover:bg-primary-100 hover:text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 dark:hover:text-primary-200"
            >
              My Appointments
            </button>
            <button
              onClick={logout}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-16 shadow-2xl shadow-primary-900/20 sm:px-12 sm:py-20 dark:from-primary-800 dark:to-slate-900">
          {/* Animated Blobs */}
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
          
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              AI Assistant is Online
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm">
              Your Health, <span className="text-primary-100">Our Priority</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-50/90 leading-relaxed sm:text-xl">
              Consult top doctors in your city, check your symptoms instantly with our advanced AI, and get personalized lifestyle tips—all in one place.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button 
                onClick={() => navigate('/chat')}
                className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold text-primary-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 dark:bg-slate-900 dark:text-white dark:hover:shadow-primary-500/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start AI Consultation
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Explore by Specialty</h3>
            <button 
              onClick={() => setSelectedSpecialty(null)}
              className="text-sm font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Clear filter
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <div key={category.name} className="col-span-1 contents">
                <button
                  onClick={() => setSelectedSpecialty(selectedSpecialty === category.name ? null : category.name)}
                  className={`group flex flex-col items-center justify-center rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:bg-slate-800 ${
                    selectedSpecialty === category.name 
                      ? 'border-primary-500 bg-primary-50 shadow-primary-500/20 dark:border-primary-500 dark:bg-primary-900/20 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-950' 
                      : 'border-slate-200 bg-white/50 hover:border-primary-300 hover:bg-white hover:shadow-primary-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary-500/50'
                  }`}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.color} text-3xl shadow-inner transition-transform group-hover:scale-110 dark:bg-opacity-20`}>
                    {category.icon}
                  </div>
                  <span className={`mt-4 text-center text-sm font-bold transition-colors ${
                    selectedSpecialty === category.name 
                      ? 'text-primary-700 dark:text-primary-400' 
                      : 'text-slate-700 group-hover:text-primary-600 dark:text-slate-300 dark:group-hover:text-primary-400'
                  }`}>
                    {category.name}
                  </span>
                  
                  {/* Doctor Count Badge */}
                  <span className="mt-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {doctors.filter(d => d.specialty === category.name).length} Doctors
                  </span>
                </button>

                {/* Expanded Accordion for Doctors in this Specialty */}
                {selectedSpecialty === category.name && (
                  <div className="col-span-full overflow-hidden animate-in slide-in-from-top-8 fade-in duration-500">
                    <div className="mt-2 mb-6 rounded-3xl border border-primary-100 bg-white/80 p-6 shadow-xl backdrop-blur-md dark:border-primary-900/30 dark:bg-slate-900/80 sm:p-8">
                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          Available {category.name}s
                        </h4>
                        <button 
                          onClick={() => setSelectedSpecialty(null)}
                          className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {doctors.filter(d => d.specialty === category.name).length > 0 ? (
                          doctors.filter(d => d.specialty === category.name).map((doctor) => (
                            <DoctorCard 
                              key={doctor._id || doctor.name} 
                              doctor={doctor} 
                              onClick={() => setSelectedDoctor(doctor)}
                            />
                          ))
                        ) : (
                          <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400">
                            No doctors found for this specialty right now.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Doctors Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Doctors Near You</h3>
            {!showAllDoctors && (
              <button 
                onClick={() => setShowAllDoctors(true)}
                className="text-sm font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                See all doctors &rarr;
              </button>
            )}
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(showAllDoctors ? doctors : doctors.slice(0, 8)).map((doctor) => (
                <DoctorCard 
                  key={doctor._id || doctor.name} 
                  doctor={doctor} 
                  onClick={() => setSelectedDoctor(doctor)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div className="mt-20 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Healthy Lifestyle Tips</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {healthTipsData.map((tip, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedTip(tip)}
                className={`group flex text-left overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl ${tip.hoverColor} dark:border-slate-800 dark:bg-slate-900/50 hover:-translate-y-1`}
              >
                <div className={`flex w-1/3 items-center justify-center bg-gradient-to-br ${tip.color} text-5xl transition-transform duration-300 group-hover:scale-105`}>
                  {tip.icon}
                </div>
                <div className="w-2/3 p-8">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{tip.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{tip.description}</p>
                  <p className="mt-4 text-xs font-bold text-primary-600 dark:text-primary-400">Read more &rarr;</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Doctor Modal Overlay */}
      <DoctorModal 
        doctor={selectedDoctor} 
        onClose={() => setSelectedDoctor(null)} 
      />

      {/* Health Tip Modal */}
      {selectedTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTip(null)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-slate-800 animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute right-4 top-4 z-20">
              <button 
                onClick={() => setSelectedTip(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-slate-500 backdrop-blur-md transition hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${selectedTip.color} text-6xl`}>
              {selectedTip.icon}
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTip.title}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{selectedTip.description}</p>
              
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Key Benefits & Tips</h4>
                <ul className="mt-3 space-y-3">
                  {selectedTip.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
