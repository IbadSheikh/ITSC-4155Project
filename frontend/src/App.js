import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReviewMap from './components/Map';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
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
      <Navbar
        isLoggedIn={isAuthenticated}
        onLogout={logoutHandler}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
      />
      <Routes>
        {/* Route for Reviews page */}
        <Route
          path="/reviews"
          element={<Reviews selectedRating={selectedRating} />}
        />
        {/* Route for Login page */}
        <Route 
          path="/login" 
          element={<Login onLogin={loginHandler} />} 
        />
        {/* Route for Signup page */}
        <Route path="/signup" element={<Signup />} />
        {/* Route for Profile page */}
        <Route path="/profile" element={<Profile />} /> 
        {/* Route for ReviewMap page */}
        <Route
          path="/map/:reviewId"
          element={<ReviewMap selectedRating={selectedRating} />} // Map for a specific reviewId
        />
        {/* Default route */}
        <Route
          path="/"
          element={
            <ReviewMap selectedRating={selectedRating} /> // Default map page without reviewId
          }
        />
      </Routes>
    </Router>
  );
};

export default App;


