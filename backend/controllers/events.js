const { db, rowToEvent } = require('../config/db');

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Competition', 'Seminar', 'Social', 'Other'];

function isValidDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

function validateEvent(body) {
  const errors = {};
  if (!body.name || !String(body.name).trim()) errors.name = 'Event name is required.';
  if (!body.category || !CATEGORIES.includes(body.category)) errors.category = 'Please select a valid category.';
  if (!isValidDate(body.date)) errors.date = 'Please provide a valid date (YYYY-MM-DD).';
  if (!body.time || !String(body.time).trim()) errors.time = 'Time is required.';
  if (!body.venue || !String(body.venue).trim()) errors.venue = 'Venue is required.';
  if (!body.description || !String(body.description).trim()) errors.description = 'Description is required.';
  if (!isValidDate(body.registrationDeadline)) errors.registrationDeadline = 'Please provide a valid registration deadline.';
  return errors;
}

function registrationOpen(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(event.registrationDeadline + 'T23:59:59');
  return deadline >= today;
}

function listEvents(req, res) {
  try {
    const { search = '', category = '', filter = '' } = req.query;
    let rows = db.prepare('SELECT * FROM events ORDER BY date ASC').all().map(rowToEvent);

    if (search) {
      const q = String(search).toLowerCase();
      rows = rows.filter((e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (category && category !== 'All') {
      rows = rows.filter((e) => e.category === category);
    }
    const todayStr = new Date().toISOString().slice(0, 10);
    if (filter === 'upcoming') rows = rows.filter((e) => e.date >= todayStr);
    else if (filter === 'past') rows = rows.filter((e) => e.date < todayStr);

    const counts = db.prepare('SELECT eventId, COUNT(*) as c FROM registrations GROUP BY eventId').all();
    const map = Object.fromEntries(counts.map((r) => [r.eventId, r.c]));
    rows = rows.map((e) => ({ ...e, registrations: map[e.id] || 0, registrationOpen: registrationOpen(e) }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load events.' });
  }
}

function getEvent(req, res) {
  try {
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ message: 'Event not found.' });
    const event = rowToEvent(row);
    const count = db.prepare('SELECT COUNT(*) as c FROM registrations WHERE eventId = ?').get(event.id).c;
    res.json({ ...event, registrations: count, registrationOpen: registrationOpen(event) });
  } catch {
    res.status(500).json({ message: 'Unable to load event.' });
  }
}

function createEvent(req, res) {
  const errors = validateEvent(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  try {
    const b = req.body;
    const info = db
      .prepare(
        `INSERT INTO events (name, category, date, time, venue, description, image, registrationDeadline, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        String(b.name).trim(),
        b.category,
        b.date,
        String(b.time).trim(),
        String(b.venue).trim(),
        String(b.description).trim(),
        String(b.image || '').trim(),
        b.registrationDeadline,
        b.featured ? 1 : 0
      );
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(rowToEvent(row));
  } catch {
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

function updateEvent(req, res) {
  const errors = validateEvent(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  try {
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Event not found.' });
    const b = req.body;
    db.prepare(
      `UPDATE events SET name=?, category=?, date=?, time=?, venue=?, description=?, image=?, registrationDeadline=?, featured=?, updatedAt=datetime('now') WHERE id=?`
    ).run(
      String(b.name).trim(), b.category, b.date, String(b.time).trim(),
      String(b.venue).trim(), String(b.description).trim(), String(b.image || '').trim(),
      b.registrationDeadline, b.featured ? 1 : 0, req.params.id
    );
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    res.json(rowToEvent(row));
  } catch {
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

function deleteEvent(req, res) {
  try {
    const info = db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    if (!info.changes) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Event deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function registerForEvent(req, res) {
  const { name = '', email = '', collegeYear = '', phone = '' } = req.body || {};
  const errors = {};
  if (!String(name).trim()) errors.name = 'Please enter your full name.';
  if (!EMAIL_RE.test(String(email).trim())) errors.email = 'Please enter a valid email address.';
  if (!String(collegeYear).trim()) errors.collegeYear = 'College / year is required.';
  if (!/^[\d\s+\-()]{7,15}$/.test(String(phone).trim())) errors.phone = 'Please enter a valid phone number.';
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });

  try {
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ message: 'Event not found.' });
    const event = rowToEvent(row);
    if (!registrationOpen(event)) return res.status(400).json({ message: 'Registration is closed for this event.' });

    const cleanEmail = String(email).trim().toLowerCase();
    const dup = db.prepare('SELECT id FROM registrations WHERE eventId = ? AND email = ?').get(event.id, cleanEmail);
    if (dup) return res.status(409).json({ message: 'You are already registered for this event.' });

    db.prepare(
      'INSERT INTO registrations (eventId, name, email, collegeYear, phone) VALUES (?, ?, ?, ?, ?)'
    ).run(event.id, String(name).trim(), cleanEmail, String(collegeYear).trim(), String(phone).trim());
    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    if (String(err && err.message).includes('UNIQUE')) {
      return res.status(409).json({ message: 'You are already registered for this event.' });
    }
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

function eventRegistrations(req, res) {
  try {
    const rows = db
      .prepare('SELECT * FROM registrations WHERE eventId = ? ORDER BY registeredAt DESC')
      .all(req.params.id);
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Unable to load registrations.' });
  }
}

module.exports = { listEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, eventRegistrations, CATEGORIES };
