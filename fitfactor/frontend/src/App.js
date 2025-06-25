import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path ="/login" element={<LoginPage />} />
                <Route path ="/signup" element={<SignupPage />} />
                <Route path = "/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }/>
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    } />
          </Routes>
      </Router>
      );
}

export default App;