import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-bold">CampusClub</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            A student-driven college club bringing students together through technical, cultural, creative and community events.
          </p>
          <div className="mt-4 flex gap-2">
            {[Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-slate-500 transition hover:border-primary-500 hover:text-primary-600">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li><Link to="/events" className="hover:text-primary-600">All Events</Link></li>
            <li><a href="/#about" className="hover:text-primary-600">About Club</a></li>
            <li><Link to="/admin/login" className="hover:text-primary-600">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Events</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/events?category=Technical" className="hover:text-primary-600">Technical</Link></li>
            <li><Link to="/events?category=Cultural" className="hover:text-primary-600">Cultural</Link></li>
            <li><Link to="/events?category=Workshop" className="hover:text-primary-600">Workshops</Link></li>
            <li><Link to="/events?category=Sports" className="hover:text-primary-600">Sports</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Student Activity Centre, Block A</li>
            <li>hello@campusclub.edu</li>
            <li>+91 98765 43210</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted sm:flex-row">
          <span>© 2026 College Club. All rights reserved.</span>
          <span>Made for students, by students.</span>
        </div>
      </div>
    </footer>
  );
}
