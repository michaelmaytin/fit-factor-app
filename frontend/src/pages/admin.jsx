import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

export default function AdminPanel() {
  const defaultForm = {
    username: "",
    email: "",
    role: "user", 
    password: "", //user creation
  };
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // fetch all users on mount and after any change
  const fetchUsers = () => {
    axios
      .get("/api/admin/users", { withCredentials: true })
      .then((res) => setUsers(res.data.data || []))
      .catch(() => setError("Could not fetch users"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // handle add/edit user form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // submit create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        // update
        await axios.put(`/api/admin/users/${editingId}`, formData, {
          withCredentials: true,
        });
      } else {
        // create
        await axios.post("/api/admin/users", formData, {
          withCredentials: true,
        });
      }
      fetchUsers();
      setFormData(defaultForm);
      setEditingId(null);
    } catch (err) {
      setError(err?.response?.data?.error || "submission failed.");
    }
  };

  // fill form with user info
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      role: user.role || "user",
      password: "",
    });
  };

  // cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setError("");
  };

  // delete user
  const handleDelete = async (id) => {
    if (!window.confirm("delete this user?")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (editingId === id) handleCancel();
    } catch (err) {
      setError("could not delete user");
    }
  };

  return (
    <div className="dashboard-card admin-panel">
      <h3 className="dashboard-section-title admin-title">
        admin panel - user management
      </h3>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h4 className="dashboard-subtitle">{editingId ? "edit user" : "add new user"}</h4>
        <div className="admin-form-row">
          <input
            type="text"
            name="username"
            value={formData.username}
            required
            placeholder="username"
            onChange={handleChange}
            autoComplete="off"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            placeholder="email"
            onChange={handleChange}
            autoComplete="off"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">user</option>
            <option value="trainer">trainer</option>
            <option value="admin">admin</option>
          </select>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder={editingId ? "(leave blank to keep current)" : "password"}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={editingId ? 0 : 6}
          />
        </div>
        <div className="admin-form-buttons">
          <button type="submit" className="admin-submit-btn">
            {editingId ? "update" : "add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={handleCancel}
            >
              cancel
            </button>
          )}
        </div>
        {error && <div className="admin-error">{error}</div>}
      </form>

      <div className="admin-users-section">
        <h4 className="dashboard-subtitle">all users</h4>
        <table className="admin-table">
          <thead>
            <tr>
              <th>username</th>
              <th>email</th>
              <th>role</th>
              <th>joined</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-na">
                  n/a
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.created_at ? String(user.created_at).slice(0, 10) : "n/a"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="admin-edit-btn"
                      title="edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="admin-delete-btn"
                      title="delete"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
