from flask import Flask, jsonify, send_from_directory, request
import os
from flask_cors import CORS
from geopy.geocoders import Nominatim

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)

# Global list to store reviews in memory
reviews = [
    {'id': 1, 'item': 'Water Fountain', 'username': 'SmoothDude', 'rating': 5, 'description': 'Cold and Crisp!', 'lat': 35.3071, 'lng': -80.7357},
    {'id': 2, 'item': 'Vending Machine', 'username': 'CoolGuy55', 'rating': 2, 'description': 'Never has honey buns..', 'lat': 35.3076, 'lng': -80.7354}
]

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# API route to get reviews
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    return jsonify(reviews)

# API route to add a new review with optional geocoding
@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    
    # Data validation
    required_fields = {'item', 'username', 'rating', 'description'}
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Attempt to get lat/lng from the request or geocode if not provided
    lat = data.get('lat')
    lng = data.get('lng')
    if not lat or not lng:
        address = data.get('location')  # Assuming location is passed as part of data
        if address:
            geolocator = Nominatim(user_agent="RateAnything")
            location = geolocator.geocode(address)
            if location:
                lat, lng = location.latitude, location.longitude
            else:
                return jsonify({'error': 'Location not found'}), 404
        else:
            return jsonify({'error': 'Location or coordinates required'}), 400

    new_review = {
        'id': len(reviews) + 1,
        'item': data['item'],
        'username': data['username'],
        'rating': data['rating'],
        'description': data['description'],
        'lat': lat,
        'lng': lng
    }
    
    reviews.append(new_review)
    return jsonify(new_review), 201

@app.route('/static/<path:path>')
def serve_static_files(path):
    return send_from_directory(os.path.join(app.static_folder, 'static'), path)

# Fallback route for React Router (client-side routing)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
