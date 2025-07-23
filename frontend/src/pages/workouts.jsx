import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './workouts.css';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    date: '',
    type: '',
    duration_mins: '',
    exercise_name: '',
    sets: '',
    reps: '',
    weight_lbs: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/workouts', { withCredentials: true })
    .then(response => {setWorkouts(response.data.data);})
    .catch(err => {console.error("Failed to load workouts:", err);});
    }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.date ||
      !form.type ||
      !form.duration_mins ||
      !form.exercise_name ||
      !form.sets ||
      !form.reps
    ) return;

    try {
       const response = await axios.post('http://localhost:5000/api/workouts', form, { withCredentials: true });
        const workout = {
          ...form,
          id: response.data.payload.id
        };
        setWorkouts(prev => [workout, ...prev]);
//         const refreshed = await axios.get('http://localhost:5000/api/workouts', { withCredentials: true });
//         setWorkouts(refreshed.data.data);

        setForm({
          date: '',
          type: '',
          duration_mins: '',
          exercise_name: '',
          sets: '',
          reps: '',
          weight_lbs: ''
        });
    }catch (err) {
        console.error("Workout submission failed", err)}
  };

   const deleteWorkout = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`, { withCredentials: true });
      setWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error("Failed to delete workout", err);
    }
  };

  return (
    <div className="workouts-centered-page">
      <div className="workouts-sidebyside-container">
        <div className="workouts-card">
          <h2 className="workouts-title">Log Workout</h2>
          <form className="workout-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Workout Type</label>
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="E.g. Cardio"
                required
              />
            </div>
            <div className="form-row">
              <label>Duration (Mins)</label>
              <input
                type="number"
                name="duration_mins"
                value={form.duration_mins}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <div className="form-row">
              <label>Exercise Name</label>
              <input
                type="text"
                name="exercise_name"
                value={form.exercise_name}
                onChange={handleChange}
                placeholder="Exercise Name"
                required
              />
            </div>
            <div className="form-row">
              <label>Sets</label>
              <input
                type="number"
                name="sets"
                value={form.sets}
                onChange={handleChange}
                min="1"
                placeholder="Sets"
                required
              />
            </div>
            <div className="form-row">
              <label>Reps</label>
              <input
                type="number"
                name="reps"
                value={form.reps}
                onChange={handleChange}
                min="1"
                placeholder="Reps"
                required
              />
            </div>
            <div className="form-row">
              <label>Weight (Lbs)</label>
              <input
                type="number"
                name="weight_lbs"
                value={form.weight_lbs}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="Weight (Lbs)"
              />
            </div>
            <button className="workout-submit-btn" type="submit">
              Add Workout
            </button>
          </form>
        </div>

        <div className="workouts-table-section">
          <h3 className="workouts-table-title">Workout History</h3>
          <div className="workouts-table-scroll">
            <table className="workouts-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="workouts-table-empty">No Workouts Logged.</td>
                  </tr>
                ) : (
                  workouts.map(w => (
                    <tr key={w.id}>
                      <td>{w.date}</td>
                      <td>{w.type}</td>
                      <td>{w.duration_mins} min</td>
                      <td>{w.exercise_name}</td>
                      <td>{w.sets}</td>
                      <td>{w.reps}</td>
                      <td>{w.weight_lbs || '-'}</td>
                      <td>
                        <button
                          className="workouts-table-delete"
                          onClick={() => deleteWorkout(w.id)}
                        >🗑</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
