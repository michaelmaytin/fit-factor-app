import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import adminpanel from './admin';
import trainerpanel from './trainer';

// placeholder set everything N/A
// const user = {
//   username: '',
//   age: '',
//   gender: '',
//   height_ft: '',
//   weight_lbs: '',
//   goal: '',
//   body_fat_percentage: '',
// };

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [meals, setMeals] = useState([]);
    const [progress, setProgress] = useState([]);

    //load user
    useEffect(() => {
        axios.get("http://localhost:5000/api/auth/users/me", {withCredentials: true})    //with credentials allows JWT token to be sent via axios
        .then(response => {setUser (response.data.data);})
        .catch(err => { window.location.href = "/login"; console.error("failed to fetch user data", err);});
       //if cookie is deleted or expired, user redirected to login upon app refresh or restart

    }, []);

    //load workouts
    useEffect(() => {
        axios.get("http://localhost:5000/api/workouts", {withCredentials: true})
        .then(response => {setWorkouts (response.data.data);})
        .catch(err => {console.error("failed to fetch workout data", err);});
    }, []);

    //load meals
    useEffect(() => {
        axios.get("http://localhost:5000/api/meals", {withCredentials: true})
        .then(response => {setMeals (response.data.data);})
        .catch(err => {console.error("failed to fetch meal data", err);});
    }, []);

    //load progress
    useEffect(() => {
        axios.get("http://localhost:5000/api/progress", {withCredentials: true})
        .then(response => {setProgress (response.data.data);})
        .catch(err => {console.error("failed to fetch progress data", err);});
    }, []);


  return (
    <div className="dashboard-centered-page">
      <div className="dashboard-main-title">Dashboard</div>

      <div className="dashboard-card dashboard-welcome">
        <h2>{user?.username ? `Welcome, ${user.username}!` : 'Welcome, Guest!'}</h2>
        <p className="dashboard-goal">
          <b>Goal:</b> {user?.goal || 'N/A'}
        </p>
      </div>

      <div className="dashboard-card dashboard-summary">
        <div>
          <div className="dashboard-stat-title">Current Weight</div>
          <div className="dashboard-stat-value">{user?.weight_lbs || 'N/A'} lbs</div>
        </div>
        <div>
          <div className="dashboard-stat-title">Body Fat %</div>
          <div className="dashboard-stat-value">{user?.body_fat_percentage || 'N/A'}%</div>
        </div>
        <div>
          <div className="dashboard-stat-title">Recent Progress</div>
          <div className="dashboard-stat-value">
            {progress[0]?.entry_date || 'N/A'}
          </div>
        </div>
      </div>

      <div className="dashboard-card-group">
        <div className="dashboard-card dashboard-section">
          <h3>Recent Workouts</h3>
          {workouts.length === 0 ? (
            <div className="dashboard-empty">N/A</div>
          ) : (
            <ul>
              {workouts.map((w, i) => (
                <li key={i}>
                  <b>{w.date || 'N/A'}:</b> {w.type || 'N/A'}, {w.duration || 'N/A'} min
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dashboard-card dashboard-section">
          <h3>Recent Meals</h3>
          {meals.length === 0 ? (
            <div className="dashboard-empty">N/A</div>
          ) : (
            <ul>
              {meals.map((m, i) => (
                <li key={i}>
                  <b>{String(m.meal_time).slice(0,16) || 'N/A'}:</b> {m.calories || 'N/A'} kcal, {m.protein_g || 'N/A'}g protein
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dashboard-card dashboard-section">
          <h3>Progress</h3>
          {progress.length === 0 ? (
            <div className="dashboard-empty">N/A</div>
          ) : (
            <ul>
              {progress.map((p, i) => (
                <li key={i}>
                  <b>{p.entry_date || 'N/A'}:</b> {p.weight_lbs || 'N/A'} lbs, {p.body_fat_percentage || 'N/A'}%
                </li>
              ))}
            </ul>
          )}
        </div>
        {user?.role === 'admin' && adminpanel()}
        {user?.role === 'trainer' && trainerpanel()}
      </div>
    </div>
  );
}
