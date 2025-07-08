Rubber Tree Detection (YOLOv8 + Flask + React)
This project is a full-stack deep learning application designed to detect and localize rubber tree leaves in images using a YOLOv8 object detection model. It features a clean and intuitive web interface for uploading images and viewing prediction results with bounding boxes.

Tech Stack:
Frontend: React + Nginx

Backend: Flask (Python)

Dataset: CVAT annotated 

Model: YOLOv8 (Ultralytics)

Containerization: Docker & Docker Compose

Deployment-ready for AWS EC2 or Render

Features:
Upload images containing rubber tree leaves

Real-time detection and localization using YOLOv8

Output images with bounding boxes drawn around detected leaves

Dockerized backend and frontend for easy deployment

Cloud-friendly architecture

📁 Project Structure
bash
Copy
Edit
rubber_leaf_detector/
│
├── backend/
│   ├── app.py               # Flask app
│   ├── weights/best.pt      # Trained YOLOv8 model
│   └── static/
│       ├── uploads/         # Uploaded images
│       └── predictions/     # YOLOv8 output images
│
├── frontend/
│   ├── UploadImage.jsx      # React component
│   ├── index.js, App.js     # React root files
│   ├── UploadImage.css      # Styling
│   └── Dockerfile           # Nginx setup
│
├── docker-compose.yml
└── README.md
