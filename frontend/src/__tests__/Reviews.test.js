import React from 'react';
import { render, screen } from '@testing-library/react';
import Reviews from '../components/Reviews'; // Ensure the path is correct

// Mock dependencies
jest.mock('../components/Review', () => {
  return function MockReview() {
    return <div>Mocked Review Component</div>;
  };
});

jest.mock('react-bootstrap', () => ({
  Alert: ({ children }) => <div>{children}</div>,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('Reviews Component', () => {
  test('renders without crashing', () => {
    render(<Reviews selectedRating={null} />);
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
  });

  test('does not crash when no reviews are available', () => {
    render(<Reviews selectedRating={null} reviews={[]} />);
    expect(screen.queryByText('Mocked Review Component')).toBeNull();
  });

  test('renders heading correctly', () => {
    render(<Reviews selectedRating={null} />);
    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });
});
