const Database = require('better-sqlite3');
const path = require('path');

const dbPath =
  process.env.DATABASE_PATH ||
  (process.env.VERCEL ? path.join('/tmp', 'data.sqlite') : path.join(__dirname, 'data.sqlite'));
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT '',
  registrationDeadline TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventId INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  collegeYear TEXT NOT NULL,
  phone TEXT NOT NULL,
  registeredAt TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(eventId, email)
);
CREATE INDEX IF NOT EXISTS idx_reg_event ON registrations(eventId);
CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
`);

function rowToEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    date: row.date,
    time: row.time,
    venue: row.venue,
    description: row.description,
    image: row.image || '',
    registrationDeadline: row.registrationDeadline,
    featured: Boolean(row.featured),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

module.exports = { db, rowToEvent };
