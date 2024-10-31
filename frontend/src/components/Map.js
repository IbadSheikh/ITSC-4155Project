import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ReviewMap = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const customIcon = L.icon({
    iconUrl: '/images/water-fountain.jpg', // Path to the image
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Error fetching reviews. Please try again later.');
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
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
      </MapContainer>
    </div>
  );
};

export default ReviewMap;

