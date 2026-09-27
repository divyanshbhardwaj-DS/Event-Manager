import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { LoadingSpinner } from '../components/ui.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { id } = useParams();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', collegeYear: '', phone: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api
      .getEvent(id)
      .then(setEvent)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: '' }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Please enter your full name.';
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Please enter a valid email address.';
    if (!form.collegeYear.trim()) er.collegeYear = 'College / year is required.';
    if (!/^[\d\s+\-()]{7,15}$/.test(form.phone.trim())) er.phone = 'Please enter a valid phone number.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.register(id, form);
      setDone(true);
      toast.success('Registration successful.');
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container-x py-8"><LoadingSpinner label="Loading..." /></div>;

  if (done) {
    return (
      <div className="container-x flex max-w-lg flex-col items-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold">Registration Successful! 🎉</h1>
        <p className="mt-2 text-[15px] text-slate-600">
          You are successfully registered for <strong>{event?.name || 'this event'}</strong>. We look forward to seeing you there!
        </p>
        <Link to="/events" className="btn-primary mt-6">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="container-x max-w-xl py-8">
      <Link to={`/events/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to event
      </Link>
      <div className="card mt-4 p-6 sm:p-8">
        <h1 className="text-xl font-extrabold tracking-tight">Register for event</h1>
        <p className="mt-1 text-sm text-muted">{event ? event.name : 'Loading event...'}</p>

        {event && !event.registrationOpen && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">Registration Closed for this event.</p>
        )}

        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Full Name *</label>
            <input id="name" className="input" placeholder="Enter your full name" value={form.name} onChange={set('name')} autoComplete="name" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email *</label>
            <input id="email" type="email" className="input" placeholder="Enter your email" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="label" htmlFor="collegeYear">College / Year *</label>
            <input id="collegeYear" className="input" placeholder="ABES Engineering College - 2nd Year" value={form.collegeYear} onChange={set('collegeYear')} />
            {errors.collegeYear && <p className="mt-1 text-xs text-red-600">{errors.collegeYear}</p>}
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone Number *</label>
            <input id="phone" type="tel" className="input" placeholder="Enter phone number" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
          <button type="submit" disabled={submitting || (event && !event.registrationOpen)} className="btn-primary w-full">
            {submitting ? 'Registering...' : 'Confirm Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
