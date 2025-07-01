from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import os
import uuid

# Set up Flask with React build folder
app = Flask(
    __name__,
    static_folder='../frontend/build',  # React build folder
    static_url_path=''  # to allow serving index.html at root
)
CORS(app)  # Enables CORS for all domains by default

UPLOAD_FOLDER = 'static/uploads'
PRED_FOLDER = 'static/predictions'
WEIGHT_PATH = os.path.join('weights', 'best.pt')

# Create folders if they don’t exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PRED_FOLDER, exist_ok=True)

# Load YOLO model
print(f"🔍 Loading model from: {os.path.abspath(WEIGHT_PATH)}")
model = YOLO(WEIGHT_PATH)

# 📦 Serve React frontend
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_react(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# 🔍 API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    ext = os.path.splitext(image.filename)[-1]
    if ext.lower() not in ['.jpg', '.jpeg', '.png']:
        ext = '.jpg'  # fallback to jpg if unknown

    filename = f"{uuid.uuid4()}{ext}"
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    # Run inference
    results = model(image_path, save=False)
    output_path = os.path.join(PRED_FOLDER, filename)
    results[0].save(filename=output_path)

    return jsonify({'prediction_path': f'/static/predictions/{filename}'})

# 📤 Serve predicted image files
@app.route('/static/predictions/<filename>')
def serve_prediction(filename):
    return send_from_directory(PRED_FOLDER, filename)

# 🏁 App entry point
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
