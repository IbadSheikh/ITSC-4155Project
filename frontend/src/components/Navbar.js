import React from 'react';
import { useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Import Link for client-side routing

const MyNavbar = ({ isLoggedIn, onLogout, onFilterChange, onClearFilter }) => {
  const [selectedRating, setSelectedRating] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    onLogout();
  };

  const handleFilterSelect = (rating) => {
    console.log('Selected Rating in Navbar:', rating);
    setSelectedRating(rating);
    onFilterChange(rating);
  };

  const handleClearFilter = () => {
    setSelectedRating(null);
    onClearFilter();
  };

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
          <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {selectedRating ? `${selectedRating} Stars` : "Filter by Rating"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Dropdown.Item key={rating} onClick={() => handleFilterSelect(rating)}>
                  {rating} Stars
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {selectedRating && (
            <Button variant="outline-light" onClick={handleClearFilter} className="ms-2">
              Clear
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;

