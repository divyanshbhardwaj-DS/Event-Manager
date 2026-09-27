const express = require('express');
const { listEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, eventRegistrations } = require('../controllers/events');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', requireAdmin, createEvent);
router.put('/:id', requireAdmin, updateEvent);
router.delete('/:id', requireAdmin, deleteEvent);

router.post('/:id/register', registerForEvent);
router.get('/:id/registrations', requireAdmin, eventRegistrations);

module.exports = router;
