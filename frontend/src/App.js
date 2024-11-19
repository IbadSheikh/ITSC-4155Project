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
        <Route path="/login" element={<Login onLogin={loginHandler} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  );
};

export default App;


