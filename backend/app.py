from flask import Flask, jsonify, send_from_directory
import os
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Example API route
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = [
        {'id': 1, 'item': 'Water Fountain', 'review': 'Clean and refreshing!'},
        {'id': 2, 'item': 'Vending Machine', 'review': 'Out of snacks.'}
    ]
    return jsonify(reviews)

@app.route('/static/<path:path>')
def serve_static_files(path):
    return send_from_directory(os.path.join(app.static_folder, 'static'), path)

# Fallback route for React Router (client-side routing)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)