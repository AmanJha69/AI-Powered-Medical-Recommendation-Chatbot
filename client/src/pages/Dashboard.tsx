import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorApi } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import DoctorCard from '../components/DoctorCard';
import type { DoctorRecommendation } from '../types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await doctorApi.list();
        setDoctors(data.slice(0, 4)); // Show top 4 doctors
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
    <div className="min-h-screen bg-slate-50">
      <DisclaimerBanner />
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-600/20">
              <span className="text-xl font-bold">+</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dr. G</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-slate-600 sm:block">
              Welcome, {user?.name}
            </span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-primary-600 px-6 py-12 shadow-2xl sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Your Health, Our Priority
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
              Consult top doctors, check your symptoms instantly with our AI, and get personalized lifestyle tips—all in one place.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={() => navigate('/chat')}
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary-600 shadow-md transition hover:bg-slate-50"
              >
                Start AI Consultation
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Explore by Specialty</h3>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View all &rarr;</button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <button
                key={category.name}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${category.color} text-2xl`}>
                  {category.icon}
                </div>
                <span className="mt-4 text-center text-sm font-medium text-slate-700">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Doctors Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Top Doctors Near You</h3>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">See all doctors &rarr;</button>
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200"></div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id || doctor.name} doctor={doctor} />
              ))}
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div className="mt-16 mb-8">
          <h3 className="text-xl font-bold text-slate-900">Healthy Lifestyle Tips</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="flex w-1/3 items-center justify-center bg-teal-100 text-4xl">
                🏃‍♂️
              </div>
              <div className="w-2/3 p-6">
                <h4 className="font-bold text-slate-900">Daily Exercise Routine</h4>
                <p className="mt-2 text-sm text-slate-600">Just 30 minutes of brisk walking every day can significantly improve your cardiovascular health.</p>
              </div>
            </div>
            <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="flex w-1/3 items-center justify-center bg-amber-100 text-4xl">
                🥗
              </div>
              <div className="w-2/3 p-6">
                <h4 className="font-bold text-slate-900">Balanced Diet Basics</h4>
                <p className="mt-2 text-sm text-slate-600">Incorporate more leafy greens and lean proteins into your meals to boost your energy levels.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
