import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock, MapPin, BookOpen, Users, Trophy, Lightbulb, Star } from 'lucide-react';
import { api } from '../services/api.js';
import { EventGrid } from '../components/ui.jsx';
import { formatDate, categoryColor } from '../utils/format.js';

const FEATURES = [
  { icon: BookOpen, title: 'Learn', text: 'Hands-on workshops, bootcamps and talks led by seniors, alumni and industry mentors.' },
  { icon: Users, title: 'Connect', text: 'Meet students across branches who share your interests — from code to culture.' },
  { icon: Trophy, title: 'Compete', text: 'Hackathons, sports leagues and contests with real prizes and recognition.' },
  { icon: Lightbulb, title: 'Create', text: 'Showcase projects, perform on stage, and build a portfolio that stands out.' },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .listEvents({ filter: 'upcoming' })
      .then((d) => {
        setEvents(Array.isArray(d) ? d : []);
        setError('');
      })
      .catch(() => setError('Unable to load events.'))
      .finally(() => setLoading(false));
  }, []);

  const featured = events.find((e) => e.featured) || events[0];
  const upcoming = events.filter((e) => !featured || e.id !== featured.id).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-primary-700 to-accent">
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-fuchsia-300/40 blur-3xl" />
        </div>
        <div className="container-x relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
          <div className="text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Star className="h-3.5 w-3.5" /> ABES Engineering College · Student Club
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Discover.<br />Participate.<br />Create.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-indigo-100">
              Your one-stop hub for every club event on campus — tech fests, hackathons, cultural nights, sports and workshops. Find your thing, register in seconds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/events" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow transition hover:bg-indigo-50">
                Explore Events <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#about" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                Learn About Club
              </a>
            </div>
            <div className="mt-8 flex gap-6 text-sm">
              <div><p className="text-2xl font-extrabold">{loading ? '—' : `${events.length}+`}</p><p className="text-indigo-200">Upcoming events</p></div>
              <div><p className="text-2xl font-extrabold">8</p><p className="text-indigo-200">Categories</p></div>
              <div><p className="text-2xl font-extrabold">100%</p><p className="text-indigo-200">Free to join</p></div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {[
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70',
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=70',
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=70',
                'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=70',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="College event"
                  loading="lazy"
                  className={`h-48 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/30 ${i % 2 ? 'mt-6' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container-x scroll-mt-20 py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-500">About our club</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">A student-driven community that brings campus to life</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            We are a student-driven college club focused on bringing students together through technical, cultural, creative and community-driven events. Whether you want to learn a skill, perform on stage, compete, or just meet new people — there is a place for you here.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary-600">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-bold">{f.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured && !loading && (
        <section className="container-x pb-14">
          <div className="card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-64">
                {featured.image && <img src={featured.image} alt={featured.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800"><Star className="h-3 w-3" /> FEATURED EVENT</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryColor(featured.category)}`}>{featured.category}</span>
                </div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{featured.name}</h2>
                <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary-500" /> {formatDate(featured.date)} · <Clock className="h-4 w-4 text-primary-500" /> {featured.time}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-500" /> {featured.venue}</p>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{featured.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {featured.registrationOpen ? (
                    <Link to={`/events/${featured.id}/register`} className="btn-primary">Register Now <ArrowRight className="h-4 w-4" /></Link>
                  ) : (
                    <span className="btn-secondary pointer-events-none opacity-60">Registration Closed</span>
                  )}
                  <Link to={`/events/${featured.id}`} className="btn-secondary">View Details</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section className="container-x pb-4">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Upcoming Events</h2>
            <p className="mt-1 text-sm text-muted">Fresh from the club calendar — grab your seat.</p>
          </div>
          <Link to="/events" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:inline-flex">
            View All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {error ? (
          <div className="card p-6 text-center text-sm text-red-600">{error}</div>
        ) : (
          <EventGrid events={upcoming} loading={loading} />
        )}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/events" className="btn-secondary w-full">View All Events →</Link>
        </div>
      </section>
    </div>
  );
}
