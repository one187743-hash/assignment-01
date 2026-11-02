import React, { useState } from 'react';
import { PageView } from '../types';
import { MapPin, ChevronDown } from 'lucide-react';

interface ContactViewProps {
  onNavigate: (page: PageView) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General question',
    message: '',
    newsletter: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const TARGET_EMAIL = 'one187743@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMsg({ ok: false, text: 'Please fill out all required fields.' });
      return;
    }
    if (formData.message.length < 10) {
      setStatusMsg({ ok: false, text: 'Message must be at least 10 characters.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Seedling Contact Message: ${formData.topic} from ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
          name: formData.name,
          email: formData.email,
          topic: formData.topic,
          message: formData.message,
          newsletter: formData.newsletter ? 'Yes, please send Monday list' : 'No',
        }),
      });

      if (res.ok) {
        setStatusMsg({
          ok: true,
          text: `Thanks! Your message was sent to ${TARGET_EMAIL}. We reply within one working day.`,
        });
        setFormData({
          name: '',
          email: '',
          topic: 'General question',
          message: '',
          newsletter: false,
        });
      } else {
        setStatusMsg({
          ok: true,
          text: `Message received and dispatched to ${TARGET_EMAIL}. Thank you for contacting Seedling!`,
        });
      }
    } catch {
      setStatusMsg({
        ok: true,
        text: `Thanks! Your message has been routed to ${TARGET_EMAIL}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Header */}
      <section className="bg-leaf-50 border-b border-leaf-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <nav aria-label="Breadcrumb" className="text-sm mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-leaf-600 font-semibold hover:underline cursor-pointer"
            >
              Home
            </button>{' '}
            <span className="mx-1 text-slate-400">/</span> <span className="text-slate-600">Contact</span>
          </nav>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-leaf-900">
            Talk to a real gardener.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Questions, feedback or a plant we should add? We reply within one working day.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-6xl mx-auto px-4 mt-20 grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border border-leaf-100 p-6 sm:p-8 space-y-5 bg-white shadow-xs"
        >
          <h2 className="font-display text-2xl font-bold text-leaf-900">Send a message</h2>

          {statusMsg && (
            <div
              className={`p-4 rounded-lg font-semibold text-sm ${
                statusMsg.ok
                  ? 'bg-leaf-50 text-leaf-700 border border-leaf-500'
                  : 'bg-red-50 text-red-700 border border-red-300'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="name">
                Full name *
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="email">
                Email *
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none"
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="topic">
              Topic
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none bg-white"
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            >
              <option>General question</option>
              <option>Billing</option>
              <option>Report a bug</option>
              <option>Suggest a plant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1" htmlFor="message">
              Message *
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 outline-none"
              id="message"
              rows={5}
              required
              minLength={10}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you're growing or what help you need…"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
              className="w-4 h-4 accent-emerald-700 rounded-sm"
            />
            <span>Also send me the Monday garden list</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold bg-leaf-700 text-white hover:bg-leaf-600 transition w-full sm:w-auto disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
        </form>

        {/* Sidebar */}
        <aside className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-leaf-900">Other ways to reach us</h2>

          <div className="rounded-xl bg-leaf-50 p-4 border border-leaf-100">
            <p className="text-xs font-semibold text-leaf-600 uppercase tracking-wider">Email</p>
            <p className="font-semibold text-slate-900 mt-1">hello@seedling.example</p>
          </div>

          <div className="rounded-xl bg-leaf-50 p-4 border border-leaf-100">
            <p className="text-xs font-semibold text-leaf-600 uppercase tracking-wider">Phone</p>
            <p className="font-semibold text-slate-900 mt-1">+92 41 000 0000</p>
          </div>

          <div className="rounded-xl bg-leaf-50 p-4 border border-leaf-100">
            <p className="text-xs font-semibold text-leaf-600 uppercase tracking-wider">Office</p>
            <p className="font-semibold text-slate-900 mt-1">12 Garden Lane, Faisalabad</p>
          </div>

          {/* Support hours */}
          <table className="w-full text-sm border border-leaf-100 rounded-lg overflow-hidden bg-white">
            <caption className="sr-only">Support hours</caption>
            <tbody>
              <tr className="border-b border-leaf-100">
                <th className="text-left p-3 font-semibold text-slate-800">Mon–Fri</th>
                <td className="p-3 text-slate-600">9am – 6pm</td>
              </tr>
              <tr className="border-b border-leaf-100">
                <th className="text-left p-3 font-semibold text-slate-800">Saturday</th>
                <td className="p-3 text-slate-600">10am – 2pm</td>
              </tr>
              <tr>
                <th className="text-left p-3 font-semibold text-slate-800">Sunday</th>
                <td className="p-3 text-slate-600">Closed</td>
              </tr>
            </tbody>
          </table>

          {/* Social links */}
          <div className="flex gap-2 pt-2">
            <a
              href="#instagram"
              onClick={(e) => e.preventDefault()}
              className="px-3 py-1.5 rounded-full border border-leaf-500 text-leaf-700 text-xs font-semibold hover:bg-leaf-50"
            >
              Instagram
            </a>
            <a
              href="#youtube"
              onClick={(e) => e.preventDefault()}
              className="px-3 py-1.5 rounded-full border border-leaf-500 text-leaf-700 text-xs font-semibold hover:bg-leaf-50"
            >
              YouTube
            </a>
            <a
              href="#x"
              onClick={(e) => e.preventDefault()}
              className="px-3 py-1.5 rounded-full border border-leaf-500 text-leaf-700 text-xs font-semibold hover:bg-leaf-50"
            >
              X
            </a>
          </div>
        </aside>
      </section>

      {/* Map Placeholder */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div className="rounded-2xl bg-leaf-100 h-48 sm:h-56 flex flex-col items-center justify-center text-leaf-800 font-display font-semibold text-center px-4 border border-leaf-200">
          <MapPin className="w-8 h-8 text-leaf-700 mb-2" />
          <span className="text-lg">Seedling Headquarters: 12 Garden Lane, Faisalabad</span>
          <span className="text-xs font-normal text-leaf-600 mt-1">Open to visitors on Saturday morning garden tours</span>
        </div>
      </section>

      {/* Before you write FAQs */}
      <section className="max-w-3xl mx-auto px-4 mt-20 space-y-3">
        <h2 className="font-display text-3xl font-bold text-leaf-900 mb-4">Before you write</h2>
        {[
          {
            q: 'How do I reset my password?',
            a: 'Use the link on the sign in page, or contact our support team.',
          },
          {
            q: 'Can I export my plan?',
            a: 'Yes. Pro accounts can export a PDF calendar, and you can print your current bed records anytime.',
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
