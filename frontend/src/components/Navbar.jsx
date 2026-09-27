import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const linkCls = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100 hover:text-ink'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold">CampusClub</span>
            <span className="block text-[11px] font-medium text-muted">Events & Community</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkCls}>Home</NavLink>
          <NavLink to="/events" className={linkCls}>Events</NavLink>
          <a href="/#about" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink">
            About Club
          </a>
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className={linkCls}>
                <span className="inline-flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" /> Dashboard</span>
              </NavLink>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/admin/login" className="btn-secondary ml-2 !py-2">Admin Login</NavLink>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" onClick={() => setOpen(false)} className={linkCls}>Home</NavLink>
            <NavLink to="/events" onClick={() => setOpen(false)} className={linkCls}>Events</NavLink>
            <a href="/#about" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">About Club</a>
            {isAdmin ? (
              <>
                <NavLink to="/admin/dashboard" onClick={() => setOpen(false)} className={linkCls}>Dashboard</NavLink>
                <button
                  onClick={() => { logout(); setOpen(false); navigate('/'); }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/admin/login" onClick={() => setOpen(false)} className={linkCls}>Admin Login</NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
