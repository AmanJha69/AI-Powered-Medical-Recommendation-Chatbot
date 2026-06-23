import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await doctorApi.list();
        setDoctors(data.slice(0, 8)); // Show top 8 doctors
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

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 relative overflow-hidden">
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
            <button className="text-sm font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">View all &rarr;</button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <button
                key={category.name}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:bg-white hover:shadow-lg hover:shadow-primary-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary-500/50 dark:hover:bg-slate-800"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.color} text-3xl shadow-inner transition-transform group-hover:scale-110 dark:bg-opacity-20`}>
                  {category.icon}
                </div>
                <span className="mt-4 text-center text-sm font-bold text-slate-700 transition-colors group-hover:text-primary-600 dark:text-slate-300 dark:group-hover:text-primary-400">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Doctors Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Doctors Near You</h3>
            <button className="text-sm font-bold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">See all doctors &rarr;</button>
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((doctor) => (
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
            <div className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex w-1/3 items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200 text-5xl transition-transform duration-300 group-hover:scale-105 dark:from-teal-900/50 dark:to-teal-800/50">
                🏃‍♂️
              </div>
              <div className="w-2/3 p-8">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Daily Exercise Routine</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Just 30 minutes of brisk walking every day can significantly improve your cardiovascular health and overall mood.</p>
              </div>
            </div>
            <div className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex w-1/3 items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-5xl transition-transform duration-300 group-hover:scale-105 dark:from-amber-900/50 dark:to-amber-800/50">
                🥗
              </div>
              <div className="w-2/3 p-8">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Balanced Diet Basics</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Incorporate more leafy greens and lean proteins into your meals to boost your energy levels and immune system.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Doctor Modal Overlay */}
      <DoctorModal 
        doctor={selectedDoctor} 
        onClose={() => setSelectedDoctor(null)} 
      />
    </div>
  );
}
