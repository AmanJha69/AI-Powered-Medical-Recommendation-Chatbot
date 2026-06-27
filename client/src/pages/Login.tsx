import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { User, Stethoscope } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Login failed';
      toast.error(message || 'Login failed');
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
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-xl shadow-primary-500/10 transition-transform hover:scale-105 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <span className="text-4xl drop-shadow-sm">🏥</span>
              </div>
              <h1 className="text-[32px] font-black tracking-tight text-slate-900 dark:text-white">
                Dr. G
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Sign in to your medical dashboard
              </p>
            </div>

            {/* Login Type Toggle */}
            <div className="mb-8 flex rounded-full bg-slate-200/50 p-1 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setLoginType('patient')}
                className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  loginType === 'patient'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <User className="h-4 w-4" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setLoginType('doctor')}
                className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  loginType === 'doctor'
                    ? 'bg-white text-primary-600 shadow-sm dark:bg-slate-700 dark:text-primary-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Stethoscope className="h-4 w-4" /> Doctor
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder={loginType === 'doctor' ? "dr.name@example.com" : "you@example.com"}
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
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="pillio-button w-full bg-primary-600 py-4 text-[15px] text-white shadow-xl shadow-primary-500/20 hover:bg-primary-700 hover:shadow-primary-600/40 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Access Dashboard'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-[15px] font-medium">
              <span className="text-slate-500 dark:text-slate-400">New patient? </span>
              <Link to="/register" className="font-bold text-primary-600 transition hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Create an account
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
