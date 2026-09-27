import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../services/api.js';
import { LoadingSpinner } from '../../components/ui.jsx';
import { formatDateTime } from '../../utils/format.js';

export default function Registrations() {
  const [rows, setRows] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventId, setEventId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    api.listEvents({}).then((d) => setEvents(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = {};
    if (search) q.search = search;
    if (eventId) q.eventId = eventId;
    if (date) q.date = date;
    const t = setTimeout(() => {
      api
        .registrations(q)
        .then((d) => setRows(Array.isArray(d) ? d : []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search, eventId, date]);

  return (
    <div>
      <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Registrations</h1>
      <p className="text-sm text-muted">{rows.length} registered students</p>

      <div className="card mt-5 space-y-3 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search registrations..." aria-label="Search registrations" className="input !pl-10"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="input" aria-label="Filter by event">
            <option value="">All Events</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" aria-label="Filter by date" />
        </div>
      </div>

      <div className="card mt-5 overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading registrations..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-slate-50 text-xs text-muted">
                  <th className="px-5 py-3 font-semibold">Student Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">College / Year</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Event</th>
                  <th className="px-5 py-3 font-semibold">Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-semibold">{r.name}</td>
                    <td className="px-5 py-3 text-muted">{r.email}</td>
                    <td className="px-5 py-3">{r.collegeYear}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{r.phone}</td>
                    <td className="px-5 py-3">{r.eventName}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-muted">{formatDateTime(r.registeredAt)}</td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No registrations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
