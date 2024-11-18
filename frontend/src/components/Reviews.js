import React, { useState, useEffect } from 'react';
import Review from './Review';
import { Alert } from 'react-bootstrap';

const Reviews = () => {
  const [reviews, setReviews] = useState([]); // Initialize as an empty array
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRating, setSelectedRating] = useState(null); // State for rating filter

  // Fetch reviews on component mount and whenever the selectedRating changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = selectedRating 
          ? `/api/reviews?rating=${selectedRating}` // Add query param if a rating is selected
          : '/api/reviews';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setErrorMessage('Error fetching reviews. Please try again later.');
      }
    };

    fetchReviews();
  }, [selectedRating]); // Re-run the effect when selectedRating changes

  // Function to handle adding a review
  const handleAddReview = async (reviewData) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(`Error: ${errorData.error}`);
        return;
      }

      const newReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, newReview]); // Update state with the new review
      setSuccessMessage('Review added successfully!'); // Display success message
    } catch (error) {
      console.error('Error adding review:', error);
      setErrorMessage('There was an error submitting the review.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Reviews</h2>

      {/* Rating Filter */}
      <div className="mb-3">
        <label>Filter by Rating: </label>
        <select onChange={(e) => setSelectedRating(Number(e.target.value))} value={selectedRating || ''}>
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <ul>
        {reviews.map((review) => (
          <Review
            key={review.id}
            item={review.item}
            username={review.username}
            rating={review.rating}
            description={review.description}
          />
        ))}
      </ul>
    </div>
  );
};

export default Reviews;


