import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const CreateReview = () => {
  const [item, setItem] = useState('');
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
  console.log('userId:', userId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!userId) {
      setErrorMessage('User ID is required. Please log in.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage('Rating must be between 1 and 5.');
      return;
    }

    const reviewData = {
      user_id: userId,
      item,
      rating: Number(rating),
      description,
      location,
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setSuccessMessage('Review added successfully!');
        // Clear the form fields
        setItem('');
        setRating(1);
        setDescription('');
        setLocation('');
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      setErrorMessage('There was an error submitting the review');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a Review</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formItem">
          <Form.Label>Item</Form.Label>
          <Form.Control
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter an address or location"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit Review
        </Button>
      </Form>
    </div>
  );
};

export default CreateReview;
