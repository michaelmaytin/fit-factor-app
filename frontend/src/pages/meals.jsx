import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './meals.css';

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString();
}
function formatTime(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Meals() {
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({
    meal_time: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fats_g: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get('/api/meals', { withCredentials: true })
      .then(res => setMeals(res.data.data))
      .catch(err => console.error("Failed to fetch meals", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`/api/meals/${editingId}`, formData, { withCredentials: true });
        const refreshed = await axios.get('/api/meals', { withCredentials: true });
        setMeals(refreshed.data.data);
        setEditingId(null);
      } else {
        const res = await axios.post('/api/meals', formData, { withCredentials: true });
        const newMeal = { ...formData, meal_id: res.data.payload.id };
        setMeals(prev => [newMeal, ...prev]);
      }

      setFormData({
        meal_time: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fats_g: '',
        notes: ''
      });
    } catch (err) {
      console.error("Meal submission failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/meals/${id}`, { withCredentials: true });
      setMeals(prev => prev.filter(m => m.meal_id !== id));
    } catch (err) {
      console.error("Meal deletion failed", err);
    }
  };

  const handleEdit = (meal) => {
    setEditingId(meal.meal_id);
    setFormData({
      meal_time: meal.meal_time || '',
      calories: meal.calories || '',
      protein_g: meal.protein_g || '',
      carbs_g: meal.carbs_g || '',
      fats_g: meal.fats_g || '',
      notes: meal.notes || ''
    });
  };

  return (
    <div className="meals-layout-static">
      <main className="meals-main-content">
        <h2 className="meals-title">Log a New Meal</h2>
        <form className="meal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Meal Time</label>
            <input
              type="datetime-local"
              name="meal_time"
              value={formData.meal_time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Calories</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-cols">
            <div>
              <label>Protein (g)</label>
              <input
                type="number"
                name="protein_g"
                value={formData.protein_g}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div>
              <label>Carbs (g)</label>
              <input
                type="number"
                name="carbs_g"
                value={formData.carbs_g}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div>
              <label>Fats (g)</label>
              <input
                type="number"
                name="fats_g"
                value={formData.fats_g}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-row">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              maxLength={150}
            />
          </div>
          <button className="meal-submit-btn" type="submit">
            Add Meal
          </button>
        </form>
      </main>
      <aside className="meals-sidebar-static">
        <h3 className="sidebar-title">All Meals</h3>
        <div className="sidebar-meal-list">
          {meals.length === 0 ? (
            <div className="sidebar-meal-empty">No meals yet.</div>
          ) : (
            meals.map(meal => (
              <div className="sidebar-meal-row" key={meal.id}>
                <>
                  <div>
                    <div className="sidebar-datetime">
                      {formatDate(meal.meal_time)} <span>{formatTime(meal.meal_time)}</span>
                    </div>
                    <div className="sidebar-macros">
                      <strong>Calories:</strong> {meal.calories}{' '}
                      <strong>Protein:</strong> {meal.protein_g}g{' '}
                      <strong>Carbs:</strong> {meal.carbs_g}g{' '}
                      <strong>Fats:</strong> {meal.fats_g}g
                    </div>
                    {meal.notes && <div className="sidebar-notes">{meal.notes}</div>}
                  </div>
                  <div className="sidebar-buttons">
                    <button
                      className="sidebar-edit-btn"
                      onClick={() => handleEdit(meal)}
                      title="Edit meal"
                    >
                      &#x270E;
                    </button>
                    <button
                      className="sidebar-delete-btn"
                      onClick={() => handleDelete(meal.id)}
                      title="Delete meal"
                      aria-label="Delete meal"
                    >
                      &#x1F5D1;
                    </button>
                  </div>
                </>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

export default Meals;
