import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ArrowLeft, Save } from 'lucide-react';
import '../App.css';

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState(false); // Track load failure specifically
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchNote = async () => {
        try {
          const res = await axiosClient.get(`/notes/${id}`);
          setTitle(res.data.data.title);
          setContent(res.data.data.content || '');
        } catch (err) {
          setError('Failed to load note. You cannot edit this note right now.');
          setLoadError(true); // Only lock editing if LOAD fails
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    }
  }, [id, isEditing]);

  const handleSave = async () => {
    if (saving || loadError) return;
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await axiosClient.put(`/notes/${id}`, { title, content });
      } else {
        await axiosClient.post('/notes', { title, content });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving || loadError}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Note'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <input
        type="text"
        className="input-field"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loadError} // Only disable if load failed
        style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', padding: '12px' }}
      />

      <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          readOnly={loadError} // Only read-only if load failed
          style={{ height: '400px', marginBottom: '40px' }}
        />
      </div>
    </div>
  );
}