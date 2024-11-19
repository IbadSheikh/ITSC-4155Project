import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Import Link for client-side routing

const MyNavbar = ({ isLoggedIn, onLogout }) => {

  const handleLogout = () => {
    localStorage.removeItem('userId');
    onLogout();
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Rate Anything</Navbar.Brand>  {/* Use Link for navigation */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>  {/* Use Link for navigation */}
            <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>  {/* Use Link for navigation */}
            {isLoggedIn ? (  // Check if the user is logged in
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;

