import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CreateReview from './CreateReview';

const ReviewMap = () => {
  const [searchParams] = useSearchParams(); // Hook to get query params
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [selectedMarkerPosition, setSelectedMarkerPosition] = useState(null);
  const [error, setError] = useState('');

  const selectedRating = searchParams.get('rating'); // Extract 'rating' query param
  const selectedReviewId = searchParams.get('reviewId'); // Extract 'reviewId' query param

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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
          iconUrl: '/images/bench.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'Vending Machine':
        return L.icon({
          iconUrl: '/images/vending-machine.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'Tree':
        return L.icon({
          iconUrl: '/images/tree.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      default:
        return defaultIcon;
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

  useEffect(() => {
    if (selectedRating !== null) {
      const filtered = reviews.filter((review) => Number(review.rating) === Number(selectedRating));
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews);
    }
  }, [selectedRating, reviews]);

  useEffect(() => {
    if (selectedReviewId) {
      const review = reviews.find((r) => String(r.id) === String(selectedReviewId));
      if (review && review.lat && review.lng) {
        setSelectedMarkerPosition([review.lat, review.lng]);
      }
    }
  }, [selectedReviewId, reviews]);

  const AddMarkerOnClick = () => {
    useMapEvents({
      click: (e) => {
        setNewMarkerPosition(e.latlng);
      },
    });
    return null;
  };

  const handleReviewSubmit = async (location) => {
    console.log('Review submitted at:', location);
    await fetchReviews();
    setNewMarkerPosition(null);
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <MapContainer center={[35.3074, -80.7352]} zoom={15} style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AddMarkerOnClick />

        {filteredReviews.map(
          (review) =>
            review.lat &&
            review.lng && (
              <Marker
                key={review.id}
                position={[review.lat, review.lng]}
                icon={getItemIcon(review.item)}
                eventHandlers={{
                  click: () => {
                    setSelectedMarkerPosition([review.lat, review.lng]);
                  },
                }}
              >
                <Popup>
                  <strong>{review.item}</strong>
                  <br />
                  Rated {review.rating}/5 stars
                  <br />
                  Reviewed by {review.username}
                  <br />
                  <small>{review.description}</small>
                </Popup>
              </Marker>
            )
        )}

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

        {selectedMarkerPosition && (
          <Marker position={selectedMarkerPosition} icon={defaultIcon}>
            <Popup>Review Selected</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ReviewMap;

