const express = require('express');
const { login, dashboard, allRegistrations } = require('../controllers/admin');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/dashboard', requireAdmin, dashboard);
router.get('/registrations', requireAdmin, allRegistrations);

module.exports = router;
