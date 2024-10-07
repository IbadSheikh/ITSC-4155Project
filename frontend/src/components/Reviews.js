import React, { useState, useEffect } from 'react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/reviews')  // Calls the Flask API
      .then(response => response.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <ul>
      {reviews.map(review => (
        <li key={review.id}>
          {review.item}: {review.review}
        </li>
      ))}
    </ul>
  );
};

export default Reviews;
