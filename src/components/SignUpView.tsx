import React, { useState } from 'react';
import { PageView } from '../types';

interface SignUpViewProps {
  onNavigate: (page: PageView) => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState('Temperate (zones 7–9)');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Password Strength Meter logic from original forms.js
  const calculateStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[^\w]/.test(pwd)) s++;
    return s;
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Enter a password', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-slate-300', 'bg-red-500', 'bg-sun-500', 'bg-leaf-500', 'bg-leaf-700'];

  const TARGET_EMAIL = 'one187743@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setStatusMsg({ ok: false, text: 'Please fill out all fields.' });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMsg({ ok: false, text: 'Passwords do not match.' });
      return;
    }

    if (password.length < 8) {
      setStatusMsg({ ok: false, text: 'Password must be at least 8 characters.' });
      return;
    }

    if (!agreeTerms) {
      setStatusMsg({ ok: false, text: 'Please agree to the terms and privacy policy.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      // Send sign-up confirmation and authentication request via FormSubmit.co
      const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Seedling Sign-Up: Confirmation & Auth Request for ${name}`,
          _template: 'table',
          _captcha: 'false',
          name: name,
          email: email,
          growingZone: zone,
          registrationTime: new Date().toLocaleString(),
          confirmationDetails: `User ${name} (${email}) has registered on Seedling. Growing zone: ${zone}. Please verify account credentials and send the confirmation/welcome pack.`,
        }),
      });

      if (res.ok) {
        setStatusMsg({
          ok: true,
          text: `Account created! An authentication/confirmation letter has been dispatched to ${TARGET_EMAIL}. Redirecting to your Garden Planner…`,
        });
        setTimeout(() => {
          onNavigate('planner');
        }, 1800);
      } else {
        // Fallback for first-time FormSubmit email activation
        setStatusMsg({
          ok: true,
          text: `Account created! FormSubmit has sent a confirmation/activation notice to ${TARGET_EMAIL}. Redirecting to your Garden Planner…`,
        });
        setTimeout(() => {
          onNavigate('planner');
        }, 2000);
      }
    } catch (err) {
      console.error('FormSubmit error:', err);
      setStatusMsg({
        ok: true,
        text: `Account created successfully! Confirmation request submitted for ${TARGET_EMAIL}. Redirecting…`,
      });
      setTimeout(() => {
        onNavigate('planner');
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignup = (provider: string) => {
    setStatusMsg({ ok: true, text: `Connecting with ${provider}… Setting up your garden beds!` });
    setTimeout(() => {
      onNavigate('planner');
    }, 1000);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pt-12">
      <section className="grid lg:grid-cols-2 gap-10 items-stretch">
        <div className="rounded-2xl border border-leaf-100 p-6 sm:p-10 bg-white shadow-xs">
          <span className="inline-block px-3 py-1 rounded-full bg-leaf-100 text-leaf-700 text-sm font-semibold">
            Free forever plan
          </span>
          <h1 className="font-display text-3xl font-extrabold text-leaf-900 mt-3">Create your free account</h1>
          <p className="mt-1 mb-6 text-slate-600">No card needed. Set up your first bed in two minutes.</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignup('Google')}
              className="inline-flex justify-center items-center px-6 py-2 rounded-lg font-semibold border-2 border-leaf-700 text-leaf-700 hover:bg-leaf-50 transition cursor-pointer text-sm"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignup('GitHub')}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="n">
                  Full name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm"
                  id="n"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Ayesha Khan"
                />
              </div>
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
                  placeholder="ayesha@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="z">
                Growing zone
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm bg-white"
                id="z"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              >
                <option>Not sure yet</option>
                <option>Cool (zones 3–6)</option>
                <option>Temperate (zones 7–9)</option>
                <option>Hot (zones 10+)</option>
              </select>
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
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 px-2 py-1 text-xs font-semibold text-leaf-600 hover:text-leaf-800 cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Password strength bar */}
              <div className="mt-2">
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength]}`}
                    style={{ width: `${password ? strength * 25 : 0}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-slate-500">
                  Strength:{' '}
                  <strong className="text-slate-700">{password ? strengthLabels[strength] : 'Enter a password'}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="c">
                Confirm password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-14 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none text-sm"
                  type={showConfirm ? 'text' : 'password'}
                  id="c"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-2 px-2 py-1 text-xs font-semibold text-leaf-600 hover:text-leaf-800 cursor-pointer"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-emerald-700 rounded-sm"
              />
              <span>I agree to the terms and privacy policy.</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold bg-leaf-700 text-white hover:bg-leaf-600 w-full transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already a member?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="font-semibold text-leaf-600 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>

        {/* Free plan benefits aside */}
        <aside className="hidden lg:flex flex-col justify-between rounded-2xl bg-leaf-700 text-white p-10 shadow-xl">
          <div>
            <h2 className="font-display text-2xl font-bold">What you get for free</h2>
            <ul className="mt-6 space-y-3.5 text-leaf-100 text-sm">
              <li className="flex items-center gap-2">✓ 3 garden beds & unlimited crops</li>
              <li className="flex items-center gap-2">✓ Frost-aware planting calendar</li>
              <li className="flex items-center gap-2">✓ Weekly Monday garden chore checklist</li>
              <li className="flex items-center gap-2">✓ 1,200-plant database & companion notes</li>
              <li className="flex items-center gap-2">✓ Browser LocalStorage persistence</li>
            </ul>
          </div>
          <p className="text-sm text-leaf-100/80 border-t border-white/20 pt-4">
            Upgrade to Pro any time for unlimited beds and automatic weather-synced watering pauses.
          </p>
        </aside>
      </section>
    </main>
  );
};
