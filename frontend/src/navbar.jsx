import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import axios from 'axios';

function AppNavbar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
          await axios.post("http://localhost:5000/api/auth/logout",{},{ withCredentials: true });
          setIsLoggedIn(false);
          navigate('/');
      } catch (err) {
          console.error("Logout failed:", err);
      }
  };

  return (
    <Navbar className="custom-blue-navbar" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="me-4">
          Fit Factor
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto gap-3">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/meals">Meals</Nav.Link>
            <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
            <Nav.Link as={Link} to="/progress">Progress</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
