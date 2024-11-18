import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CreateReview from './CreateReview';

const ReviewMap = ({ ratingFilter, setRatingFilter }) => {
  const [reviews, setReviews] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [error, setError] = useState('');

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const customIcon = L.icon({
    iconUrl: '/images/water-fountain.jpg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews. Please try again later.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Dropdown and Clear Button */}
      <div 
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.8)",
          padding: "5px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <select
          style={{
            border: "none",
            padding: "5px",
            fontSize: "14px",
            borderRadius: "3px",
            outline: "none",
            cursor: "pointer",
          }}
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
        >
          <option value="0">Filter by Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        {ratingFilter !== 0 && (
          <button
            style={{
              padding: "5px 10px",
              fontSize: "14px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setRatingFilter(0)} // Clear the filter
          >
            Clear
          </button>
        )}
      </div>

      {/* Map */}
      <MapContainer center={[35.3074, -80.7352]} zoom={15} style={{ height: '100vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reviews.map(review => (
          review.lat && review.lng && ( // Only render marker if lat and lng are valid
            <Marker
              key={review.id}
              position={[review.lat, review.lng]}
              icon={customIcon}
            >
              <Popup>
                <strong>{review.item}</strong><br />
                Rated {review.rating}/5 stars<br />
                Reviewed by {review.username}<br />
                <small>{review.description}</small>
              </Popup>
            </Marker>
          )
        ))}

        {newMarkerPosition && (
          <Marker position={newMarkerPosition} icon={defaultIcon}>
            <Popup>
              <CreateReview
                location={newMarkerPosition}
                onSuccess={() => handleReviewSubmit(newMarkerPosition)}
              />
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ReviewMap;







