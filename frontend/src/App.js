import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReviewMap from './components/Map';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Signup from './components/Signup'; // Import the Signup component
import { handleLogout, isLoggedIn } from './services/authService';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [selectedRating, setSelectedRating] = useState(null);

  const logoutHandler = () => {
    handleLogout();
    setIsAuthenticated(false);
  };

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  const handleFilterChange = (rating) => {
    console.log('Selected Rating in App.js:', rating);
    setSelectedRating(rating); // Update the selected rating
  };

  const handleClearFilter = () => {
    console.log('Filter Cleared in App.js');
    setSelectedRating(null); // Reset the filter
  };

  return (
    <Router>
      <Navbar isLoggedIn={isAuthenticated} onLogout={logoutHandler} onFilterChange={handleFilterChange} onClearFilter={handleClearFilter} />
      <Routes>
        {/* <Route path="/" element={<ReviewMap />} /> */}
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login onLogin={loginHandler} />} />
        <Route path="/signup" element={<Signup />} /> {/* Add this line for signup */}
        <Route
          path="/"
          element={
            <ReviewMap selectedRating={selectedRating} /> // Pass selectedRating to Map.js
          }
        />
      </Routes>
    </Router>
  );
};

export default App;


