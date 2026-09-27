require('dotenv').config();
const { db } = require('./config/db');
const { ensureDefaultAdmin } = require('./controllers/admin');

ensureDefaultAdmin();

const count = db.prepare('SELECT COUNT(*) as c FROM events').get().c;
if (count > 0) {
  console.log(`Events already seeded (${count}). Skipping.`);
  process.exit(0);
}

const toISO = (d) => d.toISOString().slice(0, 10);
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};

const events = [
  {
    name: 'TechFest 2026',
    category: 'Technical',
    date: inDays(18),
    time: '10:00 AM',
    venue: 'Main Auditorium',
    description: 'A college-wide technology festival featuring coding competitions, workshops, project showcases and technical talks. Meet builders, demo your projects, and compete for prizes across multiple tracks.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    registrationDeadline: inDays(16),
    featured: 1,
  },
  {
    name: 'HackNight: 24-Hour Hackathon',
    category: 'Competition',
    date: inDays(25),
    time: '6:00 PM',
    venue: 'Innovation Lab, Block C',
    description: 'Form a team of up to 4 and build something amazing in 24 hours. Mentors, meals, swag and prize pool for the best hacks in AI, web, and social impact tracks.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    registrationDeadline: inDays(23),
    featured: 0,
  },
  {
    name: 'UI/UX Design Workshop',
    category: 'Workshop',
    date: inDays(9),
    time: '2:00 PM',
    venue: 'Seminar Hall 2',
    description: 'Hands-on workshop covering design fundamentals, Figma basics, wireframing and prototyping. Bring your laptop — you will leave with a portfolio-ready case study.',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80',
    registrationDeadline: inDays(7),
    featured: 0,
  },
  {
    name: 'Cultural Night: Rhythms & Beats',
    category: 'Cultural',
    date: inDays(32),
    time: '6:30 PM',
    venue: 'Open Air Theatre',
    description: 'An evening of music, dance, drama and fashion walk presented by student societies. Auditions open for performers; audience registrations free but required.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    registrationDeadline: inDays(30),
    featured: 0,
  },
  {
    name: 'Inter-College Cricket Tournament',
    category: 'Sports',
    date: inDays(12),
    time: '8:00 AM',
    venue: 'College Cricket Ground',
    description: 'Tennis-ball cricket tournament with league + knockout format. Register as a full team (11+2) or as an individual and we will assign you a squad.',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
    registrationDeadline: inDays(10),
    featured: 0,
  },
  {
    name: 'AI & Machine Learning Bootcamp',
    category: 'Workshop',
    date: inDays(15),
    time: '11:00 AM',
    venue: 'Computer Centre Lab 1',
    description: 'Two-day intensive bootcamp on Python, scikit-learn and building your first ML model. No prior ML experience needed; basic Python recommended.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    registrationDeadline: inDays(13),
    featured: 0,
  },
  {
    name: 'Photography Walk & Contest',
    category: 'Competition',
    date: inDays(6),
    time: '7:00 AM',
    venue: 'Campus Main Gate',
    description: 'Morning photo walk around campus followed by a themed contest (theme: Campus Life). Phone or DSLR — all welcome. Winning entries will be exhibited in the library.',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80',
    registrationDeadline: inDays(5),
    featured: 0,
  },
  {
    name: 'Founders Talk: Startup Seminar',
    category: 'Seminar',
    date: inDays(21),
    time: '3:00 PM',
    venue: 'MBA Seminar Hall',
    description: 'Alumni founders share how they went from hostel-room idea to funded startup. Includes Q&A and networking over coffee.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80',
    registrationDeadline: inDays(19),
    featured: 0,
  },
  {
    name: 'Open Mic & Poetry Evening',
    category: 'Social',
    date: inDays(-4),
    time: '5:00 PM',
    venue: 'Amphitheatre',
    description: 'Our last open mic saw 120+ attendees. Poetry, standup, storytelling and acoustic sets. This edition is over, but check out upcoming socials.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
    registrationDeadline: inDays(-6),
    featured: 0,
  },
];

const stmt = db.prepare(
  `INSERT INTO events (name, category, date, time, venue, description, image, registrationDeadline, featured)
   VALUES (@name, @category, @date, @time, @venue, @description, @image, @registrationDeadline, @featured)`
);
const tx = db.transaction((list) => {
  for (const e of list) stmt.run(e);
});
tx(events);
console.log(`Seeded ${events.length} events.`);
