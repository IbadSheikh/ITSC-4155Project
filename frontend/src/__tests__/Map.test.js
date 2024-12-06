import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ReviewMap from '../components/Map'; // Ensure the path is correct
import { BrowserRouter as Router } from 'react-router-dom';

// Mock dependencies
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  useMap: () => ({ on: jest.fn() }),
}));

jest.mock('../components/CreateReview', () => () => <div>CreateReview Component</div>);

global.navigator.geolocation = {
  getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
    success({ coords: { latitude: 40.7128, longitude: -74.0060 } })
  ),
};

describe('ReviewMap Component', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <ReviewMap />
      </Router>
    );
    expect(screen.getByText(/TileLayer/i)).toBeInTheDocument();
  });

  test('renders error message when fetch fails', async () => {
    // Mock the fetchReviews function to simulate a failed fetch
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    render(
      <Router>
        <ReviewMap />
      </Router>
    );

    await waitFor(() => expect(screen.getByText(/Error fetching reviews/i)).toBeInTheDocument());
  });

  test('matches snapshot', () => {
    const { asFragment } = render(
      <Router>
        <ReviewMap />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
