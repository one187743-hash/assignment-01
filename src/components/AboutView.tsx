import React, { useState } from 'react';
import { PageView } from '../types';
import { ChevronDown } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const team = [
    { initials: 'SR', name: 'Sana Rauf', role: 'Founder, head gardener', bg: 'bg-leaf-700' },
    { initials: 'DL', name: 'Daniel Lee', role: 'Lead engineer', bg: 'bg-clay' },
    { initials: 'MP', name: 'Maria Pinto', role: 'Plant scientist', bg: 'bg-leaf-500' },
    { initials: 'OA', name: 'Omar Aziz', role: 'Community', bg: 'bg-slate-700' },
  ];

  const milestones = [
    { year: '2021', text: 'First prototype built for a single allotment.' },
    { year: '2023', text: 'Public launch with 400 plants.' },
    { year: '2025', text: 'Reached 40,000 gardeners.' },
    { year: '2026', text: 'Weather-aware watering alerts & CRUD planner released.' },
  ];

  return (
    <main>
      {/* Breadcrumb & Hero */}
      <section className="bg-leaf-50 border-b border-leaf-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <nav aria-label="Breadcrumb" className="text-sm mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-leaf-600 font-semibold hover:underline cursor-pointer"
            >
              Home
            </button>{' '}
            <span className="mx-1 text-slate-400">/</span> <span className="text-slate-600">About</span>
          </nav>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-leaf-900">
            We started with one failed tomato crop.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Seedling began in 2021 when a founder planted everything a month too early. We built the planner we wished we had.
          </p>
        </div>
      </section>

      {/* Mission & Stats */}
      <section className="max-w-6xl mx-auto px-4 mt-20 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="font-display text-3xl font-bold text-leaf-900">Our mission</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Make growing food feel as easy as checking the weather. Good timing is the biggest factor in a healthy garden, and it is the part most beginners never get told.
          </p>

          <ul className="mt-4 space-y-2 text-slate-700 text-sm">
            <li className="flex gap-2 items-center">
              <span className="text-leaf-600 font-bold">✓</span>
              <span>Advice based on local frost data</span>
            </li>
            <li className="flex gap-2 items-center">
              <span className="text-leaf-600 font-bold">✓</span>
              <span>Plain language, no jargon</span>
            </li>
            <li className="flex gap-2 items-center">
              <span className="text-leaf-600 font-bold">✓</span>
              <span>Free core features, always</span>
            </li>
          </ul>

          <button
            onClick={() => onNavigate('signup')}
            className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold bg-leaf-700 text-white hover:bg-leaf-600 mt-6 transition cursor-pointer shadow-xs"
          >
            Join Seedling
          </button>
        </div>

        {/* Achievement Progress bars */}
        <div className="rounded-2xl bg-leaf-50 p-6 space-y-5 border border-leaf-100">
          <h3 className="font-display font-semibold text-leaf-900">What gardeners achieve</h3>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-1 text-slate-700">
              <span>Fewer lost seedlings</span>
              <span>87%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
              <div className="bg-leaf-600 h-2.5 rounded-full" style={{ width: '87%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-1 text-slate-700">
              <span>Bigger harvests</span>
              <span>92%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
              <div className="bg-leaf-600 h-2.5 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-1 text-slate-700">
              <span>Less water used</span>
              <span>64%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
              <div className="bg-leaf-600 h-2.5 rounded-full" style={{ width: '64%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <h2 className="font-display text-3xl font-bold text-leaf-900">What we value</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-500 transition">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-sun-400/20 text-clay text-xs font-semibold">
              Principle
            </span>
            <h3 className="font-display text-xl font-semibold text-leaf-900 mt-3">Timing first</h3>
            <p className="mt-2 text-slate-600 text-sm">Right plant, right week.</p>
          </article>

          <article className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-500 transition">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-sun-400/20 text-clay text-xs font-semibold">
              Principle
            </span>
            <h3 className="font-display text-xl font-semibold text-leaf-900 mt-3">Honest advice</h3>
            <p className="mt-2 text-slate-600 text-sm">We tell you when not to plant.</p>
          </article>

          <article className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-500 transition">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-sun-400/20 text-clay text-xs font-semibold">
              Principle
            </span>
            <h3 className="font-display text-xl font-semibold text-leaf-900 mt-3">Shared harvests</h3>
            <p className="mt-2 text-slate-600 text-sm">Every plan includes a swap-and-share tip.</p>
          </article>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <h2 className="font-display text-3xl font-bold text-leaf-900">Our journey</h2>
        <ol className="mt-8 border-l-4 border-sun-400 pl-6 space-y-6">
          {milestones.map((m) => (
            <li key={m.year}>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-leaf-100 text-leaf-700 text-sm font-semibold">
                {m.year}
              </span>
              <p className="mt-1 text-slate-700 text-sm">{m.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The Team */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <h2 className="font-display text-3xl font-bold text-leaf-900">The team</h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name} className="rounded-2xl border border-leaf-100 p-5 text-center bg-white shadow-xs">
              <span
                className={`mx-auto w-16 h-16 rounded-full ${t.bg} text-white text-xl font-bold flex items-center justify-center`}
              >
                {t.initials}
              </span>
              <h3 className="font-display font-semibold mt-3 text-slate-900">{t.name}</h3>
              <p className="text-sm text-slate-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Quote */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <blockquote className="rounded-2xl bg-leaf-700 text-white p-10 text-center font-display text-2xl shadow-xl">
          “A garden is a conversation with the weather. We just translate.”
          <footer className="mt-4 text-base text-sun-400 font-sans font-medium">Sana Rauf, founder</footer>
        </blockquote>
      </section>

      {/* Good to know */}
      <section className="max-w-3xl mx-auto px-4 mt-20 space-y-3">
        <h2 className="font-display text-3xl font-bold text-leaf-900 mb-4">Good to know</h2>
        {[
          {
            q: 'Where are you based?',
            a: 'We work remotely across three time zones, with garden research roots in Faisalabad and London.',
          },
          {
            q: 'Are you hiring?',
            a: 'Not right now, but send us a note on the contact page if you love plants and code.',
          },
        ].map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div key={i} className="border border-leaf-100 rounded-lg p-4 bg-white transition">
              <button
                onClick={() => setOpenFaq(isOpen ? null : i)}
                className="w-full text-left cursor-pointer font-semibold text-slate-900 flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`text-sun-500 w-5 h-5 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && <p className="mt-2 text-slate-600 text-sm">{faq.a}</p>}
            </div>
          );
        })}
      </section>
    </main>
  );
};
