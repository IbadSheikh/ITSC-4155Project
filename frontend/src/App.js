import React, { useState, useEffect } from 'react';
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
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Check if location is stored in localStorage
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    } else {
      // Ask for location if not stored
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);
            localStorage.setItem('userLocation', JSON.stringify(location));
          },
          (error) => {
            console.error('Error getting location:', error);
            // Handle errors (e.g., user denied location access)
          }
        );
      }
    }
  }, []);

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
          element={<ReviewMap selectedRating={selectedRating} userLocation={userLocation} />} // Pass location
        />
        {/* Default route */}
        <Route
          path="/"
          element={
            <ReviewMap selectedRating={selectedRating} userLocation={userLocation} /> // Default map page
          }
        />
      </Routes>
    </Router>
  );
};

export default App;


