import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReviewMap from './components/Map';
import Reviews from './components/Reviews';
import CreateReview from './components/CreateReview';
import Login from './components/Login';
import Signup from './components/Signup'; // Import the Signup component
import { handleLogout, isLoggedIn } from './services/authService';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

  const logoutHandler = () => {
    handleLogout();
    setIsAuthenticated(false);
  };

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isAuthenticated} onLogout={logoutHandler} />
      <Routes>
        <Route path="/" element={<ReviewMap />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/create-review" element={<CreateReview />} />
        <Route path="/login" element={<Login onLogin={loginHandler} />} />
        <Route path="/signup" element={<Signup />} /> {/* Add this line for signup */}
      </Routes>
    </Router>
  );
};

export default App;


