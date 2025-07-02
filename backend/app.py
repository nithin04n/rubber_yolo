from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import os
import uuid
import cv2

# ✅ Updated static folder to use 'frontend_build'
app = Flask(__name__, static_folder='frontend_build', static_url_path='')
CORS(app)

# Set folders
UPLOAD_FOLDER = 'static/uploads'
PRED_FOLDER = 'static/predictions'
WEIGHT_PATH = os.path.join('weights', 'best.pt')

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PRED_FOLDER, exist_ok=True)

# Load YOLOv8 model
print(f"🔍 Loading model from: {os.path.abspath(WEIGHT_PATH)}")
model = YOLO(WEIGHT_PATH)

# ✅ Serve React frontend (index.html)
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# ✅ Serve React static assets or fallback to index.html for routing
@app.route('/<path:path>')
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# ✅ Inference route
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    ext = os.path.splitext(image.filename)[-1]
    filename = f"{uuid.uuid4()}{ext}"
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(image_path)

    print(f"📥 Received and saved: {image_path}")

    # Run YOLO prediction
    results = model(image_path, save=False)
    annotated_image = results[0].plot()

    output_path = os.path.join(PRED_FOLDER, filename)
    cv2.imwrite(output_path, annotated_image)

    print(f"✅ Prediction saved to: {output_path}")

    return jsonify({'prediction_path': f'/static/predictions/{filename}'})

# ✅ Serve predicted image
@app.route('/static/predictions/<filename>')
def serve_prediction(filename):
    return send_from_directory(PRED_FOLDER, filename)

# ✅ Run the app
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # For deployment platforms like Render or EC2
    app.run(debug=False, host='0.0.0.0', port=port)