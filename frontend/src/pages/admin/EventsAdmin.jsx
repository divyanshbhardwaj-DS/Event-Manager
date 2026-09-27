import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import { api } from '../../services/api.js';
import { Modal, LoadingSpinner } from '../../components/ui.jsx';
import { useToast } from '../../components/Toast.jsx';
import { formatDate, categoryColor } from '../../utils/format.js';

export default function EventsAdmin() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .listEvents({})
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .catch(() => toast.error('Unable to load events.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await api.deleteEvent(toDelete.id);
      toast.success('Event deleted successfully.');
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading events..." />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Events</h1>
          <p className="text-sm text-muted">{events.length} total events</p>
        </div>
        <Link to="/admin/events/add" className="btn-primary !py-2"><Plus className="h-4 w-4" /> Add Event</Link>
      </div>

      <div className="card mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-xs text-muted">
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Venue</th>
                <th className="px-5 py-3 font-semibold">Registrations</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-line last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {e.image ? <img src={e.image} alt="" className="h-10 w-14 rounded-lg object-cover" loading="lazy" /> : null}
                      <span className="font-semibold">{e.name} {e.featured && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">FEATURED</span>}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoryColor(e.category)}`}>{e.category}</span></td>
                  <td className="px-5 py-3 whitespace-nowrap">{formatDate(e.date)}</td>
                  <td className="px-5 py-3 max-w-[180px] truncate">{e.venue}</td>
                  <td className="px-5 py-3">{e.registrations ?? 0}</td>
                  <td className="px-5 py-3">
                    {e.registrationOpen
                      ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">Open</span>
                      : <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500">Closed</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Link to={`/events/${e.id}`} title="View" className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-slate-500 hover:border-primary-500 hover:text-primary-600"><Eye className="h-4 w-4" /></Link>
                      <Link to={`/admin/events/${e.id}/edit`} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-slate-500 hover:border-primary-500 hover:text-primary-600"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => setToDelete(e)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-slate-500 hover:border-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!events.length && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">No events found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={Boolean(toDelete)} title="Delete Event?" onClose={() => setToDelete(null)}>
        <p>Are you sure you want to delete <strong>{toDelete?.name}</strong>? This action cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setToDelete(null)} className="btn-secondary !py-2">Cancel</button>
          <button onClick={confirmDelete} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
