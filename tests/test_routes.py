import unittest
from app import create_app

class TestRoutes(unittest.TestCase):
    def setUp(self):
        # Set up a Flask test client
        self.app = create_app(config_class='config.TestingConfig')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        # Clean up the context after each test
        self.app_context.pop()

    def test_home_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Welcome', response.data)  # Check if 'Welcome' is in the response data
