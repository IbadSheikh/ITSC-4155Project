import React, { useState, useEffect } from 'react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);  // Ensure reviews is initialized as an empty array

  useEffect(() => {
    fetch('/api/reviews')
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);

  return (
    <ul>
      {reviews && reviews.map(review => (   // Add a safety check for 'reviews'
        <li key={review.id}>
          {review.item}: {review.review}
        </li>
      ))}
    </ul>
  );
};

export default Reviews;

