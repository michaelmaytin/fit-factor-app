import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './progress.css';

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString();
}

export default function Progress() {
  const [progressEntries, setProgressEntries] = useState([]);
  const [formData, setFormData] = useState({
    entry_date: '',
    weight_lbs: '',
    body_fat_percentage: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get('/api/progress', { withCredentials: true })
    .then(res => setProgressEntries(res.data.data))
    .catch(err => console.error("Failed to fetch progress", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (editingId) {
        await axios.put(`/api/progress/${editingId}`, formData, { withCredentials: true });
        const refreshed = await axios.get('/api/progress', { withCredentials: true });
        setProgressEntries(refreshed.data.data);
        setEditingId(null);
        } else {
        const res = await axios.post('/api/progress', formData, { withCredentials: true });
        const newEntry = { ...formData, progress_id: res.data.payload.id };
        setProgressEntries(prev => [newEntry, ...prev]);
        }

        setFormData({
          entry_date: '',
          weight_lbs: '',
          body_fat_percentage: '',
          notes: ''
        });
    } catch (err) {
      console.error("Progress submission failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/progress/${id}`, { withCredentials: true });
      setProgressEntries(prev => prev.filter(entry => entry.progress_id !== id));
    } catch (err) {
      console.error("Progress deletion failed", err);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.progress_id);
    setFormData({
      entry_date: entry.entry_date || '',
      weight_lbs: entry.weight_lbs || '',
      body_fat_percentage: entry.body_fat_percentage || '',
      notes: entry.notes || ''
    });
  };

  return (
    <div className="progress-centered-page">
      <div className="progress-card-wrapper">
        <h2 className="progress-title">log progress</h2>
        <form className="progress-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>date</label>
            <input
              type="date"
              name="entry_date"
              value={formData.entry_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>weight (lbs)</label>
            <input
              type="number"
              name="weight_lbs"
              value={formData.weight_lbs}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
            />
          </div>
          <div className="form-row">
            <label>body fat (%)</label>
            <input
              type="number"
              name="body_fat_percentage"
              value={formData.body_fat_percentage}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="100"
            />
          </div>
          <div className="form-row">
            <label>notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              maxLength={140}
            />
          </div>
          <button className="progress-submit-btn" type="submit">
            add progress
          </button>
        </form>
      </div>
      <div className="progress-log-list">
        {progressEntries.length === 0 ? (
          <div className="progress-empty">no entries yet.</div>
        ) : (
          progressEntries.map(entry => (
            <div className="progress-log-card" key={entry.progress_id}>
              <div className="progress-log-header">
                <span className="progress-log-date">{formatDate(entry.entry_date)}</span>
                <div className="progress-log-controls">
                  <button
                    className="progress-log-edit-btn"
                    onClick={() => handleEdit(entry)}
                    title="edit entry"
                  >
                    &#x270E;
                  </button>
                  <button
                    className="progress-log-delete-btn"
                    onClick={() => handleDelete(entry.progress_id)}
                    title="delete this progress entry"
                    aria-label="delete progress"
                  >
                    &#x1F5D1;
                  </button>
                </div>
              </div>
              <div className="progress-log-fields">
                <div><strong>weight:</strong> {entry.weight_lbs} lbs</div>
                {entry.body_fat_percentage && (
                  <div><strong>body fat:</strong> {entry.body_fat_percentage}%</div>
                )}
                {entry.notes && (
                  <div className="progress-log-notes">{entry.notes}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
