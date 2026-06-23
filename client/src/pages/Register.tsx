import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Registration failed';
      toast.error(message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 selection:bg-primary-500/30">
      {/* Background Orbs */}
      <div className="absolute -left-[20%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary-400/20 mix-blend-multiply blur-[120px] dark:bg-primary-600/20 dark:mix-blend-lighten animate-blob" />
      <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-400/20 mix-blend-multiply blur-[120px] dark:bg-cyan-600/20 dark:mix-blend-lighten animate-blob animation-delay-2000" />
      <div className="absolute -bottom-[20%] left-[20%] h-[600px] w-[600px] rounded-full bg-indigo-400/20 mix-blend-multiply blur-[120px] dark:bg-indigo-600/20 dark:mix-blend-lighten animate-blob animation-delay-4000" />

      <DisclaimerBanner />
      
      <div className="relative flex min-h-[calc(100vh-40px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          
          {/* Glass Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-3xl shadow-lg shadow-primary-500/30 transition-transform hover:scale-105">
                <span className="text-white drop-shadow-md">✨</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Join <span className="bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">Dr. G</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Create an account to access your personal healthcare assistant
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-3.5 px-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 hover:shadow-primary-500/40 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create your account'}
                {!loading && (
                  <svg className="absolute right-4 top-3.5 h-5 w-5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
              <Link to="/login" className="font-bold text-primary-600 transition hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Sign in here
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
