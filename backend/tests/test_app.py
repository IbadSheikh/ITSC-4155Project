import pytest
import sys
import os
from werkzeug.security import generate_password_hash
import mysql.connector
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app, get_db_connection

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def db_connection():
    connection = get_db_connection()
    yield connection
    connection.close()

def test_signup_success(client):
    response = client.post('/api/signup', json={
        'username': 'testuser',
        'password': 'securepassword'
    })
    assert response.status_code == 201
    assert response.get_json()['message'] == 'User registered successfully!'

def test_signup_duplicate_user(client, db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES (%s, %s)
    """, ('testuser', generate_password_hash('securepassword')))
    db_connection.commit()
    cursor.close()

    response = client.post('/api/signup', json={
        'username': 'testuser',
        'password': 'securepassword'
    })
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Username already exists'

def test_login_success(client, db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES (%s, %s)
    """, ('testuser', generate_password_hash('securepassword')))
    db_connection.commit()
    cursor.close()

    response = client.post('/api/login', json={
        'username': 'testuser',
        'password': 'securepassword'
    })
    assert response.status_code == 200
    assert 'token' in response.get_json()

def test_login_invalid_credentials(client):
    response = client.post('/api/login', json={
        'username': 'wronguser',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    assert response.get_json()['error'] == 'Invalid username or password'

def test_add_review_success(client, db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES (%s, %s)
    """, ('testuser', generate_password_hash('securepassword')))
    db_connection.commit()
    cursor.close()

    response = client.post('/api/reviews', json={
        'user_id': 1,
        'item': 'Water Fountain',
        'rating': 5,
        'description': 'Clean and refreshing',
        'lat': 35.2271,
        'lng': -80.8431
    })
    assert response.status_code == 201
    assert response.get_json()['message'] == 'Review added successfully!'

def test_add_review_missing_fields(client):
    response = client.post('/api/reviews', json={
        'user_id': 1,
        'item': 'Water Fountain',
        'rating': 5
    })
    assert response.status_code == 400
    assert 'error' in response.get_json()

def test_delete_review_unauthorized(client, db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES (%s, %s)
    """, ('testuser', generate_password_hash('securepassword')))
    cursor.execute("""
        INSERT INTO reviews (user_id, item, rating, description, lat, lng)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (1, 'Water Fountain', 5, 'Clean and refreshing', 35.2271, -80.8431))
    db_connection.commit()
    cursor.close()

    response = client.delete('/api/reviews/1', headers={
        'User-Id': '2'  # User ID not matching the review owner
    })
    assert response.status_code == 403
    assert response.get_json()['error'] == 'Review not found or unauthorized to delete.'

def test_get_all_reviews(client, db_connection):
    cursor = db_connection.cursor()
    cursor.execute("""
        INSERT INTO users (username, password)
        VALUES (%s, %s)
    """, ('testuser', generate_password_hash('securepassword')))
    cursor.execute("""
        INSERT INTO reviews (user_id, item, rating, description, lat, lng)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (1, 'Water Fountain', 5, 'Clean and refreshing', 35.2271, -80.8431))
    db_connection.commit()
    cursor.close()

    response = client.get('/api/reviews')
    assert response.status_code == 200
    reviews = response.get_json()
    assert isinstance(reviews, list)
    assert len(reviews) > 0
