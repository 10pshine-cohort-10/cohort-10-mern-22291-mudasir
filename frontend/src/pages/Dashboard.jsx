import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { LogOut, Plus, FileText, Trash2 } from 'lucide-react';
import '../App.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axiosClient.get('/notes');
      setNotes(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Stop the Link from triggering
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await axiosClient.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to strip HTML tags and entities for the preview
  const getPreview = (html) => {
    if (!html) return 'No content';
    return html
      .replace(/<[^>]+>/g, ' ') // Replace HTML tags with a space
      .replace(/&nbsp;/g, ' ')  // Replace non-breaking spaces
      .replace(/&amp;/g, '&')   // Replace ampersands
      .replace(/&lt;/g, '<')    // Replace less-than
      .replace(/&gt;/g, '>')    // Replace greater-than
      .trim();                  // Trim leading/trailing spaces
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600' }}>My Notes</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Link to="/notes/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> New Note
        </Link>
      </div>

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--surface-color)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any notes yet. Click "New Note" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {notes.map((note) => (
            <Link to={`/notes/${note.id}`} key={note.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ backgroundColor: 'var(--surface-color)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <FileText size={18} color="var(--primary-color)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.title}</h3>
                </div>
                
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {getPreview(note.content)}
                </p>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={(e) => handleDelete(note.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}