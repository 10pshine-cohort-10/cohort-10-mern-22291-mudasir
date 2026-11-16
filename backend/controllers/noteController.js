const noteService = require('../services/noteService');

const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    // req.user.id comes from the authMiddleware!
    const note = await noteService.createNote(req.user.id, title, content);
    req.log.info({ userId: req.user.id, noteId: note.id }, 'Note created successfully');
    res.status(201).json({ status: 'success', data: note });
  } catch (err) {
    if (err.message === 'Title is required') {
      return res.status(400).json({ status: 'error', message: err.message });
    }
    next(err);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getNotes(req.user.id);
    res.status(200).json({ status: 'success', data: notes });
  } catch (err) {
    next(err);
  }
};

const getNote = async (req, res, next) => {
  try {
    const note = await noteService.getNote(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data: note });
  } catch (err) {
    if (err.message === 'Note not found') {
      return res.status(404).json({ status: 'error', message: err.message });
    }
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await noteService.updateNote(req.params.id, req.user.id, title, content);
    req.log.info({ userId: req.user.id, noteId: note.id }, 'Note updated successfully');
    res.status(200).json({ status: 'success', data: note });
  } catch (err) {
    if (err.message === 'Note not found or unauthorized') {
      return res.status(404).json({ status: 'error', message: err.message });
    }
    if (err.message === 'Title is required') {
      return res.status(400).json({ status: 'error', message: err.message });
    }
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const result = await noteService.deleteNote(req.params.id, req.user.id);
    req.log.info({ userId: req.user.id, noteId: req.params.id }, 'Note deleted successfully');
    res.status(200).json({ status: 'success', message: result.message });
  } catch (err) {
    if (err.message === 'Note not found or unauthorized') {
      return res.status(404).json({ status: 'error', message: err.message });
    }
    next(err);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};