import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const link = ({ isActive }) =>
    `flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-primary-500 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen bg-bgsoft">
      <div className="container-x flex flex-col gap-6 py-6 lg:flex-row">
        <aside className="card h-fit w-full shrink-0 p-3 lg:sticky lg:top-20 lg:w-60">
          <div className="mb-2 px-2 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Admin Panel</p>
            <p className="truncate text-sm font-semibold">{email}</p>
          </div>
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col" aria-label="Admin">
            <NavLink to="/admin/dashboard" className={link}><LayoutDashboard className="h-4 w-4 shrink-0" /> Dashboard</NavLink>
            <NavLink to="/admin/events" className={link}><CalendarDays className="h-4 w-4 shrink-0" /> Events</NavLink>
            <NavLink to="/admin/events/add" className={link}><Plus className="h-4 w-4 shrink-0" /> Add Event</NavLink>
            <NavLink to="/admin/registrations" className={link}><Users className="h-4 w-4 shrink-0" /> Registrations</NavLink>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 shrink-0" /> Logout
            </button>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
