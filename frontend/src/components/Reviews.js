import React, { useState, useEffect } from 'react';
import Review from './Review';

const Reviews = () => {
  const [reviews, setReviews] = useState([]); // Initialize as an empty array

  useEffect(() => {
    fetch('/api/reviews')
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);

  return (
    <ul>
      {reviews && reviews.map(review => (
        <Review key={review.id} item={review.item} username={review.username} rating={review.rating} description={review.description} />
      ))}
    </ul>
  );
};

export default Reviews;

