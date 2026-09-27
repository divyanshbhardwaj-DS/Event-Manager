import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api, CATEGORIES } from '../../services/api.js';
import { useToast } from '../../components/Toast.jsx';
import { LoadingSpinner } from '../../components/ui.jsx';

const empty = {
  name: '', category: 'Technical', date: '', time: '', venue: '',
  description: '', image: '', registrationDeadline: '', featured: false,
};

export default function EventForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && id) {
      api
        .getEvent(id)
        .then((d) => setForm({ ...empty, ...d, featured: Boolean(d.featured) }))
        .catch(() => toast.error('Unable to load event.'))
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((x) => ({ ...x, [k]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'edit') {
        await api.updateEvent(id, form);
        toast.success('Event updated successfully.');
      } else {
        await api.createEvent(form);
        toast.success('Event created successfully.');
      }
      navigate('/admin/events');
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading event..." />;

  const field = (key, label, props = {}) => (
    <div>
      <label className="label" htmlFor={key}>{label}</label>
      <input id={key} className="input" value={form[key] ?? ''} onChange={set(key)} {...props} />
      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
    </div>
  );

  return (
    <div>
      <Link to="/admin/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to events
      </Link>
      <h1 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">{mode === 'edit' ? 'Edit Event' : 'Add Event'}</h1>

      <form onSubmit={submit} className="card mt-5 grid gap-4 p-5 sm:p-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field('name', 'Event Name', { placeholder: 'e.g. TechFest 2026' })}</div>
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>
          {field('venue', 'Venue', { placeholder: 'Main Auditorium' })}
          {field('date', 'Date', { type: 'date' })}
          {field('time', 'Time', { placeholder: '10:00 AM' })}
          {field('registrationDeadline', 'Registration Deadline', { type: 'date' })}
          <div className="sm:col-span-2">{field('image', 'Image URL', { placeholder: 'https://...', type: 'url' })}</div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" rows={5} className="input" placeholder="Full event description..." value={form.description} onChange={set('description')} />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium sm:col-span-2">
            <input type="checkbox" checked={Boolean(form.featured)} onChange={set('featured')} className="h-4 w-4 rounded accent-indigo-600" />
            Featured Event
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Link to="/admin/events" className="btn-secondary">Cancel</Link>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Event'}</button>
        </div>
      </form>
    </div>
  );
}
