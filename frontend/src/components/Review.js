import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';

const Review = ({ item, username, rating, description, canDelete, onDelete }) => {
  const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, index) => (
      index < rating ? <FaStar key={index} color="#ffc107" /> : <FaRegStar key={index} color="#ccc" />
    ))
  );

  return (
    <Card className="mb-3 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
      <Card.Body style={{ backgroundColor: '#f9f9f9' }}>
        <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item}</Card.Title>
        {username && (
          <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
            Reviewed by {username}
          </Card.Subtitle>
        )}
        <Card.Text className="d-flex align-items-center">
          {renderStars(rating)} <span className="ms-2 text-muted">({rating}/5)</span>
        </Card.Text>
        <Card.Text style={{ color: '#555', fontSize: '1rem' }}>{description}</Card.Text>
        {canDelete && (
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

Review.propTypes = {
  item: PropTypes.string.isRequired,
  username: PropTypes.string,
  rating: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  canDelete: PropTypes.bool, // Add new prop for conditional delete
  onDelete: PropTypes.func, // Optional prop for delete functionality
};

export default Review;

