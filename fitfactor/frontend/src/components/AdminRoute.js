import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

export default AdminRoute;