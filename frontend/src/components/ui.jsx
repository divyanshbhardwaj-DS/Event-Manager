import { Search, SearchX } from 'lucide-react';
import EventCard, { EventCardSkeleton } from './EventCard.jsx';

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search events..."
        aria-label="Search events"
        className="input !pl-10"
      />
    </div>
  );
}

export function CategoryFilter({ value, onChange, categories }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {['All', ...categories].map((c) => (
        <button
          key={c}
          onClick={() => onChange(c === 'All' ? '' : c)}
          className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
            (value || '') === (c === 'All' ? '' : c)
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-line bg-white text-slate-600 hover:border-primary-500 hover:text-primary-600'
          }`}
        >
          {c === 'All' ? 'All Categories' : c}
        </button>
      ))}
    </div>
  );
}

export function EventGrid({ events, loading }) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
      </div>
    );
  }
  if (!events.length) {
    return (
      <div className="card flex flex-col items-center px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50"><SearchX className="h-6 w-6 text-primary-500" /></span>
        <h3 className="mt-4 font-semibold">No events found.</h3>
        <p className="mt-1 max-w-sm text-sm text-muted">Try changing your search or filters.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => <EventCard key={e.id} event={e} />)}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <h3 className="font-semibold">{title}</h3>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-primary-500" />
      {label}
    </div>
  );
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="card relative w-full max-w-md p-6">
        <h3 className="text-base font-bold">{title}</h3>
        <div className="mt-2 text-sm text-slate-600">{children}</div>
      </div>
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, tone = 'bg-indigo-50 text-primary-600' }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-[13px] font-medium text-muted">{label}</p>
    </div>
  );
}
