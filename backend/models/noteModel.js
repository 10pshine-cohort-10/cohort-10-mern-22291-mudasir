const pool = require('../db');

const createNote = async (userId, title, content) => {
  const [result] = await pool.query(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
    [userId, title, content]
  );
  return result.insertId;
};

const getNotesByUserId = async (userId) => {
  // Only fetch notes that belong to this specific user
  const [rows] = await pool.query('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
};

const getNoteById = async (noteId, userId) => {
  // Ensure the note belongs to the user trying to access it
  const [rows] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
  return rows[0];
};

const updateNote = async (noteId, userId, title, content) => {
  const [result] = await pool.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
    [title, content, noteId, userId]
  );
  return result.affectedRows;
};

const deleteNote = async (noteId, userId) => {
  const [result] = await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
  return result.affectedRows;
};

module.exports = {
  createNote,
  getNotesByUserId,
  getNoteById,
  updateNote,
  deleteNote,
};