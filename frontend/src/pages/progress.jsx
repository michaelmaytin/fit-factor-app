import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: Date.now()
    };
    setProgressEntries([newEntry, ...progressEntries]);
    setFormData({
      entry_date: '',
      weight_lbs: '',
      body_fat_percentage: '',
      notes: ''
    });
  };

  const handleDelete = id => setProgressEntries(progressEntries.filter(entry => entry.id !== id));

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
            <div className="progress-log-card" key={entry.id}>
              <div className="progress-log-header">
                <span className="progress-log-date">{formatDate(entry.entry_date)}</span>
                <button
                  className="progress-log-delete-btn"
                  onClick={() => handleDelete(entry.id)}
                  title="delete this progress entry"
                  aria-label="delete progress"
                >
                  &#x1F5D1;
                </button>
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
