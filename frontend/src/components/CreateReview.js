import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const CreateReview = ({ location, onSuccess, onCancel }) => {
  const [item, setItem] = useState('');
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Check if user is logged in
    if (!userId) {
      setErrorMessage('User ID is required. Please log in.');
      return;
    }

    // Ensure location is valid (lat & lng)
    if (!location || !location.lat || !location.lng) {
      setErrorMessage('Please click on the map to select a location.');
      return;
    }

    // Ensure all form fields are filled
    if (!item || !rating || !description) {
      setErrorMessage('Please fill all fields before submitting.');
      return;
    }

    // Construct the review data to send
    const reviewData = {
      user_id: userId,
      item,
      rating: Number(rating),
      description,
      lat: location.lat,  // Coordinates from the clicked location on the map
      lng: location.lng,  // Coordinates from the clicked location on the map
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
        setItem('');
        setRating(1);
        setDescription('');
        onSuccess();  // Calls the onSuccess callback passed as prop
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

        <Button variant="primary" type="submit">
          Submit Review
        </Button>
      </Form>
      <Button variant="secondary" onClick={onCancel} className="mt-2">
        Cancel
      </Button>
    </div>
  );
};

export default CreateReview;
