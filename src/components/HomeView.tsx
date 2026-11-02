import React, { useState } from 'react';
import { PageView, WeeklyTask } from '../types';
import { CheckCircle2, Circle, Plus, ChevronDown, Sparkles, Sprout, CloudRain, Calendar, ArrowRight } from 'lucide-react';
import { SeasonalTips } from './SeasonalTips';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  weeklyTasks: WeeklyTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  weeklyTasks,
  onToggleTask,
  onAddTask,
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculate weekly progress dynamically using array methods
  const completedCount = weeklyTasks.filter((t) => t.completed).length;
  const progressPercent = weeklyTasks.length > 0 ? Math.round((completedCount / weeklyTasks.length) * 100) : 0;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      try {
        await fetch('https://formsubmit.co/ajax/one187743@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `New Monday Garden List Subscriber: ${newsletterEmail}`,
            email: newsletterEmail,
            _template: 'table',
            _captcha: 'false',
          }),
        });
      } catch (err) {
        console.error('Newsletter FormSubmit error:', err);
      }
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3500);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main>
      {/* Promo banner */}
      <div className="bg-sun-400 text-leaf-900 text-center text-sm font-semibold py-2 px-4" role="alert">
        Free 30-day trial of Seedling Pro.{' '}
        <button
          onClick={() => onNavigate('signup')}
          className="underline font-bold hover:text-leaf-800 cursor-pointer ml-1"
        >
          Start growing
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-leaf-100 text-leaf-700 text-sm font-semibold">
            Garden planning for small spaces
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-leaf-900 mt-5 leading-[1.05]">
            Know what to plant this week, not just this season.
          </h1>
          <p className="mt-5 text-lg max-w-lg text-slate-600">
            Seedling reads your frost dates and your bed layout, then sends one short task list every Monday: sow, transplant, water, harvest.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('planner')}
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold bg-leaf-700 text-white hover:bg-leaf-600 shadow-md transition cursor-pointer gap-2"
            >
              <span>Plan my garden (CRUD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold border-2 border-leaf-700 text-leaf-700 hover:bg-leaf-50 transition cursor-pointer"
            >
              How it works
            </button>
          </div>
        </div>

        {/* Interactive Sample Weekly Task List Widget */}
        <div className="rounded-3xl bg-leaf-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden" aria-label="Sample weekly task list">
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold text-sun-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>This week · Zone 7b</span>
            </p>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full text-white/90">
              Live LocalStorage
            </span>
          </div>

          {/* Task Items */}
          <ul className="mt-5 space-y-3">
            {weeklyTasks.map((task) => (
              <li
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`flex items-center gap-3 bg-white/10 rounded-lg p-3 transition cursor-pointer hover:bg-white/15 select-none ${
                  task.completed ? 'opacity-80' : ''
                }`}
              >
                <div className="text-sun-400 shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 fill-sun-400 text-leaf-700" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/60" />
                  )}
                </div>
                <span className={`text-sm sm:text-base ${task.completed ? 'line-through text-white/70' : 'text-white'}`}>
                  {task.text}
                </span>
                {task.bed && (
                  <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-sm text-sun-400/90 font-medium">
                    {task.bed}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Quick Task Add Form */}
          <form onSubmit={handleTaskSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add this week's garden chore…"
              className="flex-1 bg-white/15 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-hidden focus:ring-2 focus:ring-sun-400"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-sun-400 text-leaf-900 rounded-lg font-bold hover:bg-sun-500 transition text-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Progress bar */}
          <div className="mt-5 pt-3 border-t border-white/10">
            <div className="flex justify-between text-sm mb-1.5 font-medium">
              <span>Week progress ({completedCount}/{weeklyTasks.length} tasks)</span>
              <span className="text-sun-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sun-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl bg-leaf-50 p-8 border border-leaf-100">
          <div className="text-center">
            <dt className="font-display text-4xl font-extrabold text-leaf-700">48k</dt>
            <dd className="text-sm mt-1 text-slate-600 font-medium">gardeners</dd>
          </div>
          <div className="text-center">
            <dt className="font-display text-4xl font-extrabold text-leaf-700">1,200</dt>
            <dd className="text-sm mt-1 text-slate-600 font-medium">plants in database</dd>
          </div>
          <div className="text-center">
            <dt className="font-display text-4xl font-extrabold text-leaf-700">92%</dt>
            <dd className="text-sm mt-1 text-slate-600 font-medium">report bigger harvests</dd>
          </div>
          <div className="text-center">
            <dt className="font-display text-4xl font-extrabold text-leaf-700">4.8/5</dt>
            <dd className="text-sm mt-1 text-slate-600 font-medium">average rating</dd>
          </div>
        </dl>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-leaf-900">Everything a small garden needs</h2>
            <p className="mt-2 max-w-xl text-slate-600">Three tools, one dynamic calendar and planner.</p>
          </div>
          <button
            onClick={() => onNavigate('planner')}
            className="mt-4 md:mt-0 text-leaf-600 hover:text-leaf-700 font-semibold text-sm flex items-center gap-1 cursor-pointer"
          >
            <span>Open Garden Bed Manager</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article
            onClick={() => onNavigate('weather')}
            className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-500 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-sun-400/20 text-clay text-xs font-semibold">
                Planner
              </span>
              <Calendar className="w-5 h-5 text-leaf-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="font-display text-xl font-semibold text-leaf-900 mt-3 group-hover:text-leaf-600 transition">
              Frost-aware calendar
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Dates adjust to your postcode, so you never sow too early. Powered by real-time frost temperature checks.
            </p>
          </article>

          <article
            onClick={() => onNavigate('planner')}
            className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-500 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-sun-400/20 text-clay text-xs font-semibold">
                Layout
              </span>
              <Sprout className="w-5 h-5 text-leaf-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="font-display text-xl font-semibold text-leaf-900 mt-3 group-hover:text-leaf-600 transition">
              Bed layout & plant records
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Manage your beds with full CRUD operations, companion notes, harvest dates, and LocalStorage persistence.
            </p>
          </article>

          <article
            onClick={() => onNavigate('weather')}
            className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-500 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-sun-400/20 text-clay text-xs font-semibold">
                Alerts
              </span>
              <CloudRain className="w-5 h-5 text-leaf-600 group-hover:scale-110 transition" />
            </div>
            <h3 className="font-display text-xl font-semibold text-leaf-900 mt-3 group-hover:text-leaf-600 transition">
              Watering & Weather reminders
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Rain forecasts pause reminders when nature has it covered. Live Axios integration with Open-Meteo.
            </p>
          </article>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <h2 className="font-display text-3xl font-bold text-leaf-900">From seed to supper in three steps</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3 border-l-4 md:border-l-0 md:border-t-4 border-sun-400 pl-6 md:pl-0 md:pt-6">
          <li className="space-y-1">
            <span className="text-xs font-bold text-sun-500 uppercase tracking-wider">Step One</span>
            <h3 className="font-display font-semibold text-lg text-leaf-900">1. Tell us where you garden</h3>
            <p className="text-slate-600 text-sm">Enter your postcode and bed sizes to match your local climate.</p>
          </li>
          <li className="space-y-1">
            <span className="text-xs font-bold text-sun-500 uppercase tracking-wider">Step Two</span>
            <h3 className="font-display font-semibold text-lg text-leaf-900">2. Pick your plants</h3>
            <p className="text-slate-600 text-sm">Choose from over 1,200 vegetables, herbs and flowers with companion tips.</p>
          </li>
          <li className="space-y-1">
            <span className="text-xs font-bold text-sun-500 uppercase tracking-wider">Step Three</span>
            <h3 className="font-display font-semibold text-lg text-leaf-900">3. Follow the weekly list</h3>
            <p className="text-slate-600 text-sm">Tick tasks off and watch your harvest charts grow with confidence.</p>
          </li>
        </ol>
      </section>

      {/* Seasonal Gardening Tips Section */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <SeasonalTips
          onAddCustomTask={onAddTask}
          onNavigateToPlanner={() => onNavigate('planner')}
          compact={true}
        />
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <h2 className="font-display text-3xl font-bold text-leaf-900">Gardeners say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <figure className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-200 transition">
            <blockquote className="text-slate-700 italic">
              “My balcony produced 14 kg of tomatoes. I only ever checked the Monday list.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-leaf-700 text-white font-bold flex items-center justify-center shrink-0">
                AK
              </span>
              <span>
                <strong className="block text-slate-900">Ayesha Khan</strong>
                <span className="text-sm text-slate-500">Balcony gardener</span>
              </span>
            </figcaption>
          </figure>

          <figure className="rounded-2xl border border-leaf-100 p-6 bg-white hover:border-leaf-200 transition">
            <blockquote className="text-slate-700 italic">
              “I stopped losing seedlings to late frost. That alone paid for the Pro plan.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-clay text-white font-bold flex items-center justify-center shrink-0">
                TM
              </span>
              <span>
                <strong className="block text-slate-900">Tom Mercer</strong>
                <span className="text-sm text-slate-500">Allotment holder</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 mt-20">
        <h2 className="font-display text-3xl font-bold text-leaf-900 text-center">Questions</h2>
        <div className="mt-8 space-y-3">
          {[
            {
              q: 'Is Seedling free?',
              a: 'The core planner is free. Pro adds unlimited beds and weather alerts. The CRUD planner and weather API in this app are completely free to use.',
            },
            {
              q: 'Does it work in my climate?',
              a: 'Yes. We use frost data and real-time Open-Meteo forecasts for over 40,000 postcodes worldwide.',
            },
            {
              q: 'Can I cancel Pro?',
              a: 'Anytime, with one click in your account settings.',
            },
          ].map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="border border-leaf-100 rounded-lg p-4 bg-white transition">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left cursor-pointer font-semibold text-slate-900 flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`text-sun-500 w-5 h-5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && <p className="mt-2 text-slate-600 text-sm animate-in fade-in duration-200">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div className="rounded-3xl bg-leaf-700 text-white p-10 text-center">
          <h2 className="font-display text-3xl font-bold">Get the Monday list in your inbox</h2>
          <p className="mt-2 text-leaf-100/80 text-sm max-w-md mx-auto">
            Receive personalized weekly tasks for your micro-climate and garden layout every Monday morning.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <label className="sr-only" htmlFor="nl">
              Email
            </label>
            <input
              id="nl"
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="flex-1 rounded-lg px-4 py-3 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sun-400"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold bg-sun-400 text-leaf-900 hover:bg-sun-500 whitespace-nowrap transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          {newsletterSuccess && (
            <div className="mt-4 p-3 bg-leaf-800 text-sun-400 font-semibold rounded-lg text-sm max-w-md mx-auto border border-sun-400/30">
              ✓ You are subscribed! See you next Monday morning.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
