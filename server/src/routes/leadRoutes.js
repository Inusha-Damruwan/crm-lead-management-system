const express = require('express');
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All lead routes require authentication
router.use(authMiddleware);

// Dashboard stats
router.get('/dashboard/stats', leadController.getDashboardStats);
router.get('/users', leadController.getUsers);

// CRUD operations
router.get('/', leadController.getLeads);
router.post('/', leadController.createLead);
router.get('/:id', leadController.getLead);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

// Notes
router.get('/:id/notes', leadController.getNotes);
router.post('/:id/notes', leadController.addNote);

module.exports = router;
