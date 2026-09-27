import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, User, ArrowLeft, Hourglass } from 'lucide-react';
import { api } from '../services/api.js';
import { LoadingSpinner } from '../components/ui.jsx';
import { formatDate, categoryColor } from '../utils/format.js';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getEvent(id)
      .then((d) => {
        setEvent(d);
        setError('');
      })
      .catch((e) => setError(e.status === 404 ? 'Event not found.' : 'Unable to load event.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container-x py-8"><LoadingSpinner label="Loading event..." /></div>;
  if (error || !event) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="text-2xl font-extrabold">Looks like this event doesn&apos;t exist.</h1>
        <p className="mt-2 text-sm text-muted">{error}</p>
        <Link to="/events" className="btn-primary mt-6">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="card mt-4 overflow-hidden">
        <div className="relative aspect-[21/9] bg-slate-100">
          {event.image ? (
            <img src={event.image} alt={event.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 text-5xl">🎓</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:left-6">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryColor(event.category)}`}>{event.category}</span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{event.name}</h1>
          </div>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-bold">About this event</h2>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-slate-600">{event.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { icon: CalendarDays, k: 'Date', v: formatDate(event.date) },
                { icon: Clock, k: 'Time', v: event.time },
                { icon: MapPin, k: 'Venue', v: event.venue },
                { icon: User, k: 'Organizer', v: 'CampusClub · Student Council' },
                { icon: Hourglass, k: 'Register by', v: formatDate(event.registrationDeadline) },
              ].map((r) => (
                <div key={r.k} className="flex items-start gap-3 rounded-xl border border-line bg-bgsoft p-3.5">
                  <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{r.k}</p>
                    <p className="text-sm font-semibold">{r.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-bgsoft p-5 lg:sticky lg:top-20">
            <p className="text-sm font-bold">Registration</p>
            <p className="mt-1 text-[13px] text-muted">
              {event.registrations || 0} student{event.registrations === 1 ? '' : 's'} registered
            </p>
            <div className="mt-4">
              {event.registrationOpen ? (
                <Link to={`/events/${event.id}/register`} className="btn-primary w-full">Register Now</Link>
              ) : (
                <span className="flex w-full items-center justify-center rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500">
                  Registration Closed
                </span>
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Free entry. You will receive a confirmation once registered. Carry your college ID to the venue.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
