import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, ArrowRight } from 'lucide-react';
import { formatDate, categoryColor } from '../utils/format.js';

export default function EventCard({ event }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {event.image ? (
          <img src={event.image} alt={event.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 text-4xl">🎓</div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryColor(event.category)}`}>
          {event.category}
        </span>
        {!event.registrationOpen && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            Closed
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-[15px] font-bold">{event.name}</h3>
        <div className="mt-2 space-y-1.5 text-[13px] text-muted">
          <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary-500" /> {formatDate(event.date)} · <Clock className="h-3.5 w-3.5 text-primary-500" /> {event.time}</p>
          <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary-500" /> <span className="line-clamp-1">{event.venue}</span></p>
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{event.description}</p>
        <div className="mt-4 flex gap-2">
          <Link to={`/events/${event.id}`} className="btn-secondary flex-1 !px-3 !py-2 !text-[13px]">
            View Details
          </Link>
          {event.registrationOpen ? (
            <Link to={`/events/${event.id}/register`} className="btn-primary flex-1 !px-3 !py-2 !text-[13px]">
              Register <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="flex flex-1 items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-[13px] font-semibold text-slate-400">
              Closed
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/9] !rounded-none" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-full" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-9 flex-1" />
          <div className="skeleton h-9 flex-1" />
        </div>
      </div>
    </div>
  );
}
