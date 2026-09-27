const bcrypt = require('bcryptjs');
const { db } = require('../config/db');
const { signAdmin } = require('../middleware/auth');

function ensureDefaultAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@collegeclub.edu').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const existing = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
  if (!existing) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO admins (email, passwordHash) VALUES (?, ?)').run(email, hash);
    console.log(`Seeded default admin: ${email}`);
  }
}

function login(req, res) {
  const { email = '', password = '' } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(String(email).toLowerCase().trim());
  if (!admin) return res.status(401).json({ message: 'Invalid email or password.' });
  const ok = bcrypt.compareSync(String(password), admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });
  const token = signAdmin(admin);
  res.json({ token, email: admin.email });
}

function dashboard(req, res) {
  try {
    const totalEvents = db.prepare('SELECT COUNT(*) as c FROM events').get().c;
    const todayStr = new Date().toISOString().slice(0, 10);
    const upcomingEvents = db.prepare('SELECT COUNT(*) as c FROM events WHERE date >= ?').get(todayStr).c;
    const totalRegistrations = db.prepare('SELECT COUNT(*) as c FROM registrations').get().c;
    const todaysRegistrations = db.prepare("SELECT COUNT(*) as c FROM registrations WHERE date(registeredAt) = date('now')").get().c;
    const recent = db
      .prepare(
        `SELECT r.*, e.name as eventName FROM registrations r JOIN events e ON e.id = r.eventId ORDER BY r.registeredAt DESC LIMIT 5`
      )
      .all();
    res.json({ totalEvents, upcomingEvents, totalRegistrations, todaysRegistrations, recentRegistrations: recent });
  } catch {
    res.status(500).json({ message: 'Unable to load dashboard.' });
  }
}

function allRegistrations(req, res) {
  try {
    const { search = '', eventId = '', date = '' } = req.query;
    let rows = db
      .prepare(
        `SELECT r.*, e.name as eventName FROM registrations r JOIN events e ON e.id = r.eventId ORDER BY r.registeredAt DESC`
      )
      .all();
    if (eventId) rows = rows.filter((r) => String(r.eventId) === String(eventId));
    if (date) rows = rows.filter((r) => String(r.registeredAt).slice(0, 10) === String(date));
    if (search) {
      const q = String(search).toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.eventName || '').toLowerCase().includes(q) ||
          r.collegeYear.toLowerCase().includes(q)
      );
    }
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Unable to load registrations.' });
  }
}

module.exports = { login, dashboard, allRegistrations, ensureDefaultAdmin };
