const noteModel = require('../models/noteModel');

const createNote = async (userId, title, content) => {
  if (!title) {
    throw new Error('Title is required');
  }
  const noteId = await noteModel.createNote(userId, title, content);
  return { id: noteId, title, content };
};

const getNotes = async (userId) => {
  return await noteModel.getNotesByUserId(userId);
};

const getNote = async (noteId, userId) => {
  const note = await noteModel.getNoteById(noteId, userId);
  if (!note) {
    throw new Error('Note not found');
  }
  return note;
};

const updateNote = async (noteId, userId, title, content) => {
  if (!title) {
    throw new Error('Title is required');
  }
  const affectedRows = await noteModel.updateNote(noteId, userId, title, content);
  if (affectedRows === 0) {
    throw new Error('Note not found or unauthorized');
  }
  return { id: noteId, title, content };
};

const deleteNote = async (noteId, userId) => {
  const affectedRows = await noteModel.deleteNote(noteId, userId);
  if (affectedRows === 0) {
    throw new Error('Note not found or unauthorized');
  }
  return { message: 'Note deleted successfully' };
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};