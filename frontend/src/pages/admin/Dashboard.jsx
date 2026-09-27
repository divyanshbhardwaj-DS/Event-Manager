import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CalendarCheck, Users, UserPlus } from 'lucide-react';
import { api } from '../../services/api.js';
import { StatCard, LoadingSpinner } from '../../components/ui.jsx';
import { formatDateTime } from '../../utils/format.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .dashboard()
      .then((d) => {
        setData(d);
        setError('');
      })
      .catch(() => setError('Unable to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <div className="card p-6 text-center text-sm text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Dashboard</h1>
          <p className="text-sm text-muted">Overview of events and registrations.</p>
        </div>
        <Link to="/admin/events/add" className="btn-primary !py-2">+ New Event</Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total Events" value={data.totalEvents} />
        <StatCard icon={CalendarCheck} label="Upcoming Events" value={data.upcomingEvents} tone="bg-green-50 text-green-600" />
        <StatCard icon={Users} label="Total Registrations" value={data.totalRegistrations} tone="bg-violet-50 text-violet-600" />
        <StatCard icon={UserPlus} label="Today's Registrations" value={data.todaysRegistrations} tone="bg-amber-50 text-amber-600" />
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-bold">Recent Registrations</h2>
          <Link to="/admin/registrations" className="text-[13px] font-semibold text-primary-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-xs text-muted">
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">College / Year</th>
                <th className="px-5 py-3 font-semibold">Registered</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentRegistrations || []).map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3"><p className="font-semibold">{r.name}</p><p className="text-muted">{r.email}</p></td>
                  <td className="px-5 py-3">{r.eventName}</td>
                  <td className="px-5 py-3">{r.collegeYear}</td>
                  <td className="px-5 py-3 text-muted">{formatDateTime(r.registeredAt)}</td>
                </tr>
              ))}
              {!(data.recentRegistrations || []).length && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted">No registrations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
