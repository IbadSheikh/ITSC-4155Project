import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const CreateReview = () => {
  const [item, setItem] = useState('');
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const reviewData = {
      item,
      username,
      rating,
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
        const newReview = await response.json();
        setSuccessMessage('Review added successfully!');
        // Clear the form fields
        setItem('');
        setUsername('');
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

        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
