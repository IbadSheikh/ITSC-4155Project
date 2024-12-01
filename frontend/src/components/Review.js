import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Review = ({
  item,
  username,
  rating,
  description,
  canDelete,
  onDelete,
  onNavigate, // New prop for navigation
  disableNavigation = false,
}) => {
  // Handle the card click
  const handleCardClick = (e) => {
    if (disableNavigation) return; // Prevent navigation if disabled
    if (e.target.closest('button')) return; // Prevent navigation if a button was clicked
    if (onNavigate) onNavigate(); // Call the navigation function passed down
  };

  return (
    <Card
      className="mb-3 shadow-sm"
      style={{ borderRadius: '10px', overflow: 'hidden', cursor: disableNavigation ? 'default' : 'pointer' }}
      onClick={handleCardClick} // Handle the click event for the card
    >
      <Card.Body style={{ backgroundColor: '#f9f9f9' }}>
        <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item}</Card.Title>
        {username && (
          <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
            Reviewed by {username}
          </Card.Subtitle>
        )}
        <Card.Text className="d-flex align-items-center">
          {Array.from({ length: 5 }, (_, index) =>
            index < rating ? <FaStar key={index} color="#ffc107" /> : <FaRegStar key={index} color="#ccc" />
          )}{" "}
          <span className="ms-2 text-muted">({rating}/5)</span>
        </Card.Text>
        <Card.Text style={{ color: '#555', fontSize: '1rem' }}>{description}</Card.Text>
        {canDelete && (
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click event
              if (onDelete) onDelete();
            }}
          >
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
  canDelete: PropTypes.bool,
  onDelete: PropTypes.func,
  reviewId: PropTypes.string.isRequired, // Ensure reviewId is passed as a prop
  disableNavigation: PropTypes.bool, // New optional prop
};

Review.defaultProps = {
  username: null,
  canDelete: false,
  onDelete: null,
  disableNavigation: false, // Default behavior allows navigation
};

export default Review;

