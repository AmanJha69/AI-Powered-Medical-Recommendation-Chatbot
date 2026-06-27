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
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafd] dark:bg-slate-950 selection:bg-primary-500/30">
      {/* Premium Pillio Abstract Background */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
        <img src="/pillio-bg.png" alt="abstract background" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-lighten" />
      </div>
      <div className="absolute -left-[20%] -top-[10%] h-[600px] w-[600px] rounded-full bg-primary-400/10 mix-blend-multiply blur-[120px] dark:bg-primary-600/10 dark:mix-blend-lighten animate-blob" />
      <div className="absolute -right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-teal-400/10 mix-blend-multiply blur-[120px] dark:bg-teal-600/10 dark:mix-blend-lighten animate-blob animation-delay-2000" />
      <div className="absolute -bottom-[20%] left-[20%] h-[700px] w-[700px] rounded-full bg-indigo-400/10 mix-blend-multiply blur-[120px] dark:bg-indigo-600/10 dark:mix-blend-lighten animate-blob animation-delay-4000" />

      <DisclaimerBanner />
      
      <div className="relative z-10 flex min-h-[calc(100vh-40px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-700">
          
          {/* Glass Card */}
          <div className="pillio-card border-white/50 bg-white/60 backdrop-blur-3xl p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-xl shadow-primary-500/10 transition-transform hover:scale-105 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <span className="text-4xl drop-shadow-sm">✨</span>
              </div>
              <h1 className="text-[32px] font-black tracking-tight text-slate-900 dark:text-white">
                Join Dr. G
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Create an account for your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pillio-input block w-full pl-12 bg-white/70 backdrop-blur-md"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pillio-input block w-full pl-12 bg-white/70 backdrop-blur-md"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-2">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pillio-input block w-full pl-12 bg-white/70 backdrop-blur-md"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="pillio-button w-full bg-primary-600 py-4 text-[15px] text-white shadow-xl shadow-primary-500/20 hover:bg-primary-700 hover:shadow-primary-600/40 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-[15px] font-medium">
              <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
              <Link to="/login" className="font-bold text-primary-600 transition hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Sign in here
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
