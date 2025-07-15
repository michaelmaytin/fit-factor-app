import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './navbar';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Progress from './pages/progress';
import Meals from './pages/meals';
import Profile from './pages/profile';
import { Container } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {!isLoggedIn ? (
        <Routes>
          <Route path="*" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      ) : (
        <>
          <AppNavbar setIsLoggedIn={setIsLoggedIn} />
          <Container style={{ marginTop: '3rem' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </>
      )}
    </Router>
  );
}

export default App;
