import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import Review from './Review'; // Import the reusable Review component

const Profile = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Replace with your actual auth mechanism

  // Fetch user's reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/user/${userId}`);
      if (!response.ok) {
        throw new Error('Error fetching reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError('Unable to fetch your reviews. Please try again later.');
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchReviews();
    }
  }, [userId, navigate]);

  return (
    <Container className="my-5">
      <h1>My Profile</h1>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>

      <h2 className="mt-4">My Reviews</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Review
            key={review.id} // Use a unique key for each review
            item={review.item}
            username={null} // Username is not displayed on the user's profile
            rating={review.rating}
            description={review.description}
          />
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </Container>
  );
};

export default Profile;

