import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMeal = {
      ...formData,
      id: Date.now()
    };
    setMeals([newMeal, ...meals]);
    setFormData({
      meal_time: '',
      calories: '',
      protein_g: '',
      carbs_g: '',
      fats_g: '',
      notes: ''
    });
  };

  const handleDelete = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
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
                <button
                  className="sidebar-delete-btn"
                  onClick={() => handleDelete(meal.id)}
                  title="Delete meal"
                  aria-label="Delete meal"
                >
                  &#x1F5D1;
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

export default Meals;
