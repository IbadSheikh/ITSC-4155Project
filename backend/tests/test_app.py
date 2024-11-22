import unittest
from unittest.mock import patch, MagicMock
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

class TestApp(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.client = app.test_client()

    @patch('app.get_db_connection')
    def test_register_user(self, mock_db_connection):
        # Mocking DB connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.execute.return_value = None 
        mock_connection.commit.return_value = None

        # Make a POST request
        response = self.app.post('/api/signup', json={
            'username': 'testuser',
            'password': 'testpassword'
        })


        self.assertEqual(response.status_code, 201)
        self.assertIn('User registered successfully!', response.get_json()['message'])

    @patch('app.get_db_connection')
    def test_add_review(self, mock_db_connection):
        # Mocking DB connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.execute.return_value = None 
        mock_connection.commit.return_value = None

        response = self.app.post('/api/reviews', json={
            'user_id': 1,
            'item': 'Test Item',
            'rating': 5,
            'description': 'Test Description',
            'lat': 12.34,
            'lng': 56.78
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn('Review added successfully!', response.get_json()['message'])

    @patch('app.get_db_connection')
    def test_get_reviews(self, mock_db_connection):
        # Mocking DB connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        # Mocking return value of reviews
        mock_cursor.fetchall.return_value = [
            {
                'id': 1,
                'item': 'Test Item',
                'rating': 5,
                'description': 'Test Description',
                'lat': 12.34,
                'lng': 56.78,
                'user_id': 1,
                'username': 'testuser'
            }
        ]

        response = self.app.get('/api/reviews')

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.get_json(), list)

    @patch('app.get_db_connection')
    def test_delete_review(self, mock_db_connection):
        # Mocking DB connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_db_connection.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        # Mocking delete query execution
        mock_cursor.execute.return_value = None
        mock_connection.commit.return_value = None

        response = self.app.delete('/api/reviews/1', headers={'User-Id': '1'})

        self.assertEqual(response.status_code, 200)
        self.assertIn('Review deleted successfully!', response.get_json()['message'])

if __name__ == '__main__':
    unittest.main()