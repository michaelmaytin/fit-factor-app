import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Meals from './pages/meals';
import Progress from './pages/progress';

function PrivateRoute({ element, isLoggedIn }) {
  return isLoggedIn ? element : <Navigate to="/login" replace />;
}

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const hideNavbar = ['/login', '/signup'].includes(location.pathname.toLowerCase());

  return (
    <>
      {!hideNavbar && <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />

        {/* private */}
        <Route
          path="/"
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<Dashboard />} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<Dashboard />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<Profile />} />}
        />
        <Route
          path="/meals"
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<Meals />} />}
        />
        <Route
          path="/progress"
          element={<PrivateRoute isLoggedIn={isLoggedIn} element={<Progress />} />}
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

export default App;
