import React, { useState } from 'react';
import { PageView } from '../types';

interface SignInViewProps {
  onNavigate: (page: PageView) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMsg({ ok: false, text: 'Please fill in both email and password.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMsg({ ok: true, text: 'Signed in. Redirecting to your Garden Planner…' });
      setTimeout(() => {
        onNavigate('planner');
      }, 1200);
    }, 600);
  };

  const handleOAuthLogin = (provider: string) => {
    setStatusMsg({ ok: true, text: `Connecting with ${provider}… Redirecting to your Garden Planner!` });
    setTimeout(() => {
      onNavigate('planner');
    }, 1000);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pt-12">
      <section className="grid lg:grid-cols-2 gap-10 items-stretch">
        <div className="rounded-2xl border border-leaf-100 p-6 sm:p-10 bg-white shadow-xs">
          <span className="inline-block px-3 py-1 rounded-full bg-leaf-100 text-leaf-700 text-sm font-semibold">
            Member sign in
          </span>
          <h1 className="font-display text-3xl font-extrabold text-leaf-900 mt-3">Welcome back</h1>
          <p className="mt-1 mb-6 text-slate-600">Sign in to see this week’s garden tasks and crop plans.</p>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('Google')}
              className="inline-flex justify-center items-center px-6 py-2 rounded-lg font-semibold border-2 border-leaf-700 text-leaf-700 hover:bg-leaf-50 transition cursor-pointer text-sm"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('GitHub')}
              className="inline-flex justify-center items-center px-6 py-2 rounded-lg font-semibold border-2 border-leaf-700 text-leaf-700 hover:bg-leaf-50 transition cursor-pointer text-sm"
            >
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm my-5 text-slate-400">
            <hr className="flex-1 border-slate-200" />
            or with email
            <hr className="flex-1 border-slate-200" />
          </div>

          {statusMsg && (
            <div
              className={`p-4 rounded-lg font-semibold text-sm mb-5 ${
                statusMsg.ok
                  ? 'bg-leaf-50 text-leaf-700 border border-leaf-500'
                  : 'bg-red-50 text-red-700 border border-red-300'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="e">
                Email
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm"
                type="email"
                id="e"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="p">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-14 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm"
                  type={showPassword ? 'text' : 'password'}
                  id="p"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 px-2 py-1 text-xs font-semibold text-leaf-600 hover:text-leaf-800 cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 rounded-sm"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="font-semibold text-leaf-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold bg-leaf-700 text-white hover:bg-leaf-600 w-full transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-600">
              New here?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="font-semibold text-leaf-600 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </form>
        </div>

        {/* Aside Quote */}
        <aside className="hidden lg:flex flex-col justify-between rounded-2xl bg-leaf-700 text-white p-10 shadow-xl">
          <div>
            <p className="font-display text-2xl leading-snug">
              “I open Seedling every Monday with my tea. It tells me exactly what to do.”
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-sun-400 text-leaf-900 font-bold flex items-center justify-center shrink-0">
                AK
              </span>
              <span>Ayesha Khan, balcony gardener</span>
            </div>
          </div>
          <ul className="space-y-2 text-leaf-100 text-sm">
            <li className="flex items-center gap-2">✓ Weekly task list</li>
            <li className="flex items-center gap-2">✓ Frost alerts</li>
            <li className="flex items-center gap-2">✓ Harvest log</li>
          </ul>
        </aside>
      </section>
    </main>
  );
};
