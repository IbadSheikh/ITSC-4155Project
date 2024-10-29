import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReviewMap from './components/Map';
import Reviews from './components/Reviews';
import CreateReview from './components/CreateReview';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ReviewMap />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/create-review" element={<CreateReview />} />
      </Routes>
    </Router>
  );
};

export default App;


