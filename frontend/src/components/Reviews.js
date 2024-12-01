import React, { useState, useEffect } from 'react';
import Review from './Review';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // For navigation to the map

const Reviews = ({ selectedRating }) => {
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

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

  const filteredReviews = selectedRating
    ? reviews.filter((review) => Number(review.rating) === Number(selectedRating))
    : reviews;

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

  // Navigate to the map with the reviewId as a query parameter
  const handleNavigate = (reviewId) => {
    if (!reviewId) {
      console.error("Review ID is undefined!");
      return;
    }
    navigate(`/?reviewId=${reviewId}`);
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
            lat={review.lat}
            lng={review.lng}
            canDelete={Number(review.user_id) === Number(userId)}
            onDelete={() => handleDelete(review.id)}
            onNavigate={() => 
            {
              console.log('Review ID:', review.id);
              handleNavigate(review.id)} // Pass the query param handler
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default Reviews;

