from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import os
import uuid
import cv2

# Initialize Flask with static React build folder
app = Flask(
    __name__,
    static_folder='../frontend/build',  # React build output
    static_url_path=''  # Allows serving index.html at root '/'
)
CORS(app)

UPLOAD_FOLDER = 'static/uploads'
PRED_FOLDER = 'static/predictions'
WEIGHT_PATH = os.path.join('weights', 'best.pt')

# Create folders if they don’t exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PRED_FOLDER, exist_ok=True)

# Load model
print(f"🔍 Loading model from: {os.path.abspath(WEIGHT_PATH)}")
model = YOLO(WEIGHT_PATH)

# Serve React frontend at root
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve React static files (JS, CSS, images, etc.)
@app.route('/<path:path>')
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        # Fallback to index.html for client-side routing
        return send_from_directory(app.static_folder, 'index.html')

# Inference route
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    filename = f"{uuid.uuid4()}{os.path.splitext(image.filename)[-1]}"
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    # Run inference
    results = model(image_path, save=False)
    output_path = os.path.join(PRED_FOLDER, filename)

    # Save the prediction image with annotations
    annotated_image = results[0].plot()
    cv2.imwrite(output_path, annotated_image)

    return jsonify({'prediction_path': f'/static/predictions/{filename}'})

# Serve predicted image
@app.route('/static/predictions/<filename>')
def serve_prediction(filename):
    return send_from_directory(PRED_FOLDER, filename)

# App entry point (port managed via environment variable for Render)
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render sets PORT
    app.run(debug=False, host='0.0.0.0', port=port)
