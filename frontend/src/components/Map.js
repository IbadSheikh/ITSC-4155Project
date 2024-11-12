import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CreateReview from './CreateReview';

const ReviewMap = () => {
  const [reviews, setReviews] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [error, setError] = useState('');

  // Default Leaflet marker icon
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png', // Default Leaflet icon URL
    iconSize: [25, 41],  // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  // Your custom marker icon (for reviews that are submitted)
  const customIcon = L.icon({
    iconUrl: '/images/water-fountain.jpg', // Path to the image for custom icon
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  // Fetch reviews from the server
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

  useEffect(() => {
    fetchReviews();
  }, []);

  // Custom hook to handle map clicks and place a marker
  const AddMarkerOnClick = () => {
    useMapEvents({
      click: (e) => {
        setNewMarkerPosition(e.latlng); // Set new marker position when map is clicked
      },
    });
    return null;
  };

  // Handle review submission
  const handleReviewSubmit = (location) => {
    console.log('Review submitted at:', location);
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <MapContainer center={[35.3074, -80.7352]} zoom={15} style={{ height: '100vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <AddMarkerOnClick /> {/* Enables marker on click */}

        {/* Render reviews markers */}
        {reviews.map(review => (
          review.lat && review.lng && (
            <Marker
              key={review.id}
              position={[review.lat, review.lng]}
              icon={customIcon} // Use your custom icon for submitted reviews
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

        {/* Render new marker with default icon for new clicks */}
        {newMarkerPosition && (
          <Marker position={newMarkerPosition} icon={defaultIcon}>
            <Popup>
              <CreateReview 
                location={newMarkerPosition} 
                onSubmitReview={handleReviewSubmit} // Pass a callback to handle submission
              />
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ReviewMap;

