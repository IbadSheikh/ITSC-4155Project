import React, { useState, useEffect } from 'react';
import Review from './Review';
import { Alert } from 'react-bootstrap';

const Reviews = ({ selectedRating }) => {
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Reviews:', data);
        setReviews(data);
      } catch (error) {
        setErrorMessage('Error fetching reviews. Please try again later.');
      }
    };

    fetchReviews();
  }, []);

  console.log('Selected Rating in Reviews:', selectedRating);
  console.log('All Reviews:', reviews);

  const filteredReviews = selectedRating
    ? reviews.filter((review) => Number(review.rating) === Number(selectedRating))
    : reviews;

  console.log('Filtered Reviews:', filteredReviews);

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'User-Id': userId,
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting review');
      }

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
      setSuccessMessage('Review deleted successfully!');
    } catch (error) {
      setErrorMessage('Unable to delete the review. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Reviews</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <ul>
        {filteredReviews.map((review) => (
          <Review
            key={review.id}
            item={review.item}
            username={review.username}
            rating={review.rating}
            description={review.description}
            canDelete={Number(review.user_id) === Number(userId)}
            onDelete={() => handleDelete(review.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Reviews;

