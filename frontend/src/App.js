import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import axios from 'axios'
import Navbar from './navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Meals from './pages/meals';
import Progress from './pages/progress';
import Workouts from './pages/workouts';

function PrivateRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AppContent({ isLoggedIn, setIsLoggedIn, me, setMe }) {
  const location = useLocation();
  const hideNavbar = ['/login', '/signup'].includes(location.pathname.toLowerCase());

  return (
    <>
      {!hideNavbar && <Navbar me={me} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setMe={setMe} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setMe={setMe} />} />

        <Route
          path="/"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/meals"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Meals />
            </PrivateRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Progress />
            </PrivateRoute>
          }
        />
        <Route
          path="/workouts"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Workouts />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // set true for debug!
  const [me, setMe] = useState(null);
  useEffect(() => {
    axios
      .get('/api/auth/me', { withCredentials: true })
      .then(res => {
        setIsLoggedIn(true);
        setMe(res.data);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setMe(null);
      });
  }, []);
  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        me={me}
        setMe={setMe}
      />
    </Router>
  );
}

export default App;
