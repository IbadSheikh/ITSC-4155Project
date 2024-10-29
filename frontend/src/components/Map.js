import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const ReviewMap = () => {
  const [reviews, setReviews] = useState([]); // Initialize as an empty array

  useEffect(() => {
    // Fetch data from the API
    fetch('/api/reviews')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Check the data
        setReviews(data);  // Set the reviews state
      })
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);

  return (
    <MapContainer center={[35.3074, -80.7352]} zoom={15} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reviews.map(review => (
        <Marker key={review.id} position={[review.lat, review.lng]}>
          <Popup>
            {review.item}: {review.rating}/5 stars
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ReviewMap;

