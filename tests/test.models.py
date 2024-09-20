import unittest
from app import create_app, db
from app.models import User  # Example model

class TestModels(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config_class='config.TestingConfig')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_user_model(self):
        user = User(username='testuser', email='test@example.com')
        db.session.add(user)
        db.session.commit()
        self.assertEqual(User.query.count(), 1)