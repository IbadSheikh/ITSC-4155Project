import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CreateReview from './CreateReview';

const ReviewMap = ({ selectedRating }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [error, setError] = useState('');

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Function to return an icon based on the item type
  const getItemIcon = (itemType) => {
    switch (itemType) {
      case 'Water Fountain':
        return L.icon({
          iconUrl: '/images/water-fountain.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'Bench':
        return L.icon({
          iconUrl: '/images/bench.png', // Replace with your image URL
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'Vending Machine':
        return L.icon({
          iconUrl: '/images/vending-machine.png', // Replace with your image URL
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'Tree':
        return L.icon({
          iconUrl: '/images/tree.png', // Replace with your image URL
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      default:
        return defaultIcon; // Default icon for unknown item types
    }
  };

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

  // Filter reviews whenever the selectedRating changes
  useEffect(() => {
    if (selectedRating !== null) {
      const filtered = reviews.filter((review) => review.rating === selectedRating);
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews); // Show all reviews if no filter is applied
    }
  }, [selectedRating, reviews]);

  const AddMarkerOnClick = () => {
    useMapEvents({
      click: (e) => {
        setNewMarkerPosition(e.latlng); // Set new marker position when map is clicked
      },
    });
    return null;
  };

  const handleReviewSubmit = async (location) => {
    console.log('Review submitted at:', location);
    await fetchReviews();
    setNewMarkerPosition(null); // Remove the marker
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <MapContainer center={[35.3074, -80.7352]} zoom={15} style={{ height: '100vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AddMarkerOnClick />

        {filteredReviews.map((review) => (
          review.lat && review.lng && (
            <Marker
              key={review.id}
              position={[review.lat, review.lng]}
              icon={getItemIcon(review.item)} // Dynamically set the icon based on item type
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

