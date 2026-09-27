import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { api, CATEGORIES } from '../services/api.js';
import { SearchBar, CategoryFilter, EventGrid } from '../components/ui.jsx';

export default function Events() {
  const [params, setParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [filter, setFilter] = useState(params.get('filter') || 'upcoming');

  useEffect(() => {
    setLoading(true);
    const q = {};
    if (search) q.search = search;
    if (category) q.category = category;
    if (filter) q.filter = filter;
    const t = setTimeout(() => {
      api
        .listEvents(q)
        .then((d) => {
          setEvents(Array.isArray(d) ? d : []);
          setError('');
        })
        .catch(() => setError('Unable to load events.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search, category, filter]);

  const hasFilters = search || category || filter !== 'upcoming';

  const clearAll = () => {
    setSearch('');
    setCategory('');
    setFilter('');
    setParams({});
  };

  const shown = useMemo(() => events, [events]);

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">All Events</h1>
      <p className="mt-1 text-sm text-muted">Search, filter and find your next experience.</p>

      <div className="card mt-6 space-y-4 p-4 sm:p-5">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} categories={CATEGORIES} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-medium text-muted">Show:</span>
          {[
            { v: 'upcoming', l: 'Upcoming' },
            { v: '', l: 'All' },
            { v: 'past', l: 'Past' },
          ].map((o) => (
            <button
              key={o.l}
              onClick={() => setFilter(o.v)}
              className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${
                filter === o.v ? 'border-primary-500 bg-indigo-50 text-primary-700' : 'border-line bg-white text-slate-600 hover:border-primary-500'
              }`}
            >
              {o.l}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearAll} className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-red-600 hover:underline">
              <X className="h-3.5 w-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {!loading && !error && (
          <p className="mb-3 text-[13px] text-muted" aria-live="polite">
            {shown.length === 0 ? 'No matching events found.' : `${shown.length} event${shown.length === 1 ? '' : 's'} found`}
          </p>
        )}
        {error ? <div className="card p-6 text-center text-sm text-red-600">{error}</div> : <EventGrid events={shown} loading={loading} />}
      </div>
    </div>
  );
}
