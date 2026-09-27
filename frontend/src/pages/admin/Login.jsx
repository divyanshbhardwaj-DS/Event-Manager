import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';

export default function AdminLogin() {
  const { login, isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }
    setBusy(true);
    try {
      await login(form);
      toast.success('Welcome back, admin.');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-x flex max-w-md flex-col py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to site
      </Link>
      <div className="card mt-4 p-6 sm:p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-primary-600">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold">Admin Login</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage events and registrations.</p>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700" role="alert">{error}</p>}
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email / Username</label>
            <input
              id="email" type="email" className="input" placeholder="admin@collegeclub.edu"
              value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} autoComplete="username"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password" type="password" className="input" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} autoComplete="current-password"
            />
          </div>
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-xs leading-relaxed text-muted">
          Demo credentials — email: <code className="font-semibold text-ink">admin@collegeclub.edu</code> · password: <code className="font-semibold text-ink">Admin@123</code> (override via backend <code>.env</code>).
        </p>
      </div>
    </div>
  );
}
