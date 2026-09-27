require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const adminRouter = require('./routes/admin');
const { ensureDefaultAdmin } = require('./controllers/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get('/api/categories', (req, res) => {
  res.json(['Technical', 'Cultural', 'Sports', 'Workshop', 'Competition', 'Seminar', 'Social', 'Other']);
});

app.use('/api/events', eventsRouter);
app.use('/api/admin', adminRouter);

app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }));

ensureDefaultAdmin();

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
