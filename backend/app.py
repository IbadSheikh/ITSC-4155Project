from flask import Flask, jsonify, request, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import os
from dotenv import load_dotenv
from flask_cors import CORS
import jwt
import datetime
from geopy.geocoders import Nominatim

load_dotenv()

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_static_files(path):
    # Serve static files if they exist, otherwise serve index.html for React Router
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Register a new user
@app.route('/api/signup', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data['username']
    password = data['password']

    hashed_password = generate_password_hash(password)
    
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = "INSERT INTO users (username, password) VALUES (%s, %s)"
        cursor.execute(query, (username, hashed_password))
        connection.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except mysql.connector.errors.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 400
    finally:
        cursor.close()
        connection.close()

# Login user
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data['username']
    password = data['password']

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user and check_password_hash(user['password'], password):
        print(user)
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, os.getenv('SECRET_KEY'), algorithm='HS256')
        return jsonify({
            'message': 'Login successful!', 
            'user_id': user['id'],
            'token': token
            }), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# Add a review (requires user_id from login)
@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    user_id = data.get('user_id')
    item = data['item']
    rating = data['rating']
    description = data['description']
    address = data.get('location')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    # Geocode the address if provided
    lat, lng = None, None
    print(address)
    if address:
        geolocator = Nominatim(user_agent="RateAnythingApp")
        try:
            location = geolocator.geocode(address)
            if location:
                lat, lng = location.latitude, location.longitude
            else:
                return jsonify({'error': 'Invalid address provided'}), 400
        except Exception as e:
            print(f"Geocoding error: {e}")
            return jsonify({'error': 'Failed to retrieve location data.'}), 500
    else:
        return jsonify({'error': 'Address is required to get coordinates'}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = connection.cursor()

    query = """
    INSERT INTO reviews (user_id, item, rating, description, lat, lng)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (user_id, item, rating, description, lat, lng))
    connection.commit()
    
    cursor.close()
    connection.close()
    
    return jsonify({'message': 'Review added successfully!'}), 201

# Get all reviews
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    rating = request.args.get('rating', None)  # Get the rating filter if it exists
    query = """ 
        SELECT reviews.id, reviews.item, reviews.rating, reviews.description, reviews.lat, reviews.lng, users.username 
        FROM reviews 
        JOIN users ON reviews.user_id = users.id 
    """
    
    # Apply filter if rating is provided
    if rating:
        query += " WHERE reviews.rating = %s"
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    if rating:
        cursor.execute(query, (rating,))
    else:
        cursor.execute(query)
    
    reviews = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    return jsonify(reviews)

@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT 1')  # Simple query to test the connection
        cursor.fetchone()  # Fetch the result to ensure the query ran successfully
        return {'status': 'success', 'message': 'Database is connected!'}, 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)}, 500
    finally:
        cursor.close()
        connection.close()


if __name__ == '__main__':
    app.run(debug=True)
