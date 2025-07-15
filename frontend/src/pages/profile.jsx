import React, { useState } from 'react';
import './profile.css';

// placeholder info
function Profile() {
  const [user, setUser] = useState({
    username: "Guest",
    email: "guest@email.com",
    age: 25,
    gender: "Male",
    height_ft: 5.10,
    weight_lbs: 190,
    goal: "Lose Weight"
  });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(form);
    setEditMode(false);
    // backend
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        {!editMode ? (
          <>
            <h2 className="profile-name">{user.username}</h2>
            <div className="profile-info-list">
              <div className="profile-row">
                <div className="profile-label">Email:</div>
                <div className="profile-value">{user.email}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Age:</div>
                <div className="profile-value">{user.age}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Gender:</div>
                <div className="profile-value">{user.gender}</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Height:</div>
                <div className="profile-value">{user.height_ft} ft</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Weight:</div>
                <div className="profile-value">{user.weight_lbs} lbs</div>
              </div>
              <div className="profile-row">
                <div className="profile-label">Goal:</div>
                <div className="profile-value">{user.goal}</div>
              </div>
            </div>
            <button
              className="edit-profile-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSave} className="profile-info-list">
            <h2 className="profile-name">{form.username}</h2>
            <div className="profile-row">
              <div className="profile-label">Email:</div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="profile-input"
              />
            </div>
            <div className="profile-row">
              <div className="profile-label">Age:</div>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="profile-input"
              />
            </div>
            <div className="profile-row">
              <div className="profile-label">Gender:</div>
              <input
                type="text"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="profile-input"
              />
            </div>
            <div className="profile-row">
              <div className="profile-label">Height:</div>
              <input
                type="number"
                step="0.01"
                name="height_ft"
                value={form.height_ft}
                onChange={handleChange}
                className="profile-input"
              />
            </div>
            <div className="profile-row">
              <div className="profile-label">Weight:</div>
              <input
                type="number"
                name="weight_lbs"
                value={form.weight_lbs}
                onChange={handleChange}
                className="profile-input"
              />
            </div>
            <div className="profile-row">
              <div className="profile-label">Goal:</div>
              <input
                type="text"
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="profile-input"
              />
            </div>
            <button className="edit-profile-btn" type="submit">
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
