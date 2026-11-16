const express = require('express');
const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply the 'protect' middleware to ALL routes in this file
router.use(protect);

router.route('/')
  .post(noteController.createNote)
  .get(noteController.getNotes);

router.route('/:id')
  .get(noteController.getNote)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;