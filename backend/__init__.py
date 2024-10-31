from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__, static_folder='frontend/build', static_url_path='/')
    app.config.from_object('config')
    CORS(app)  # Enable CORS

    from .routes import main
    app.register_blueprint(main)

    return app
