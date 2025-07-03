  # 🌿 Rubber Tree Disease Detection (YOLOv8 + Flask + React)

This project is a full-stack deep learning application that detects diseases in rubber tree leaves using a YOLOv8 object detection model. It provides a user-friendly web interface to upload leaf images and get predictions with bounding boxes.

---

## 🔧 Tech Stack

- **Frontend**: React + Nginx
- **Backend**: Flask (Python)
- **Model**: YOLOv8 (`Ultralytics`)
- **Containerization**: Docker & Docker Compose
- **Deployment-ready** for AWS EC2 or Render

---

## 🚀 Features

- Upload rubber tree leaf images
- Real-time disease detection using trained YOLOv8 model
- Prediction images with bounding boxes
- Dockerized backend and frontend
- Easily deployable on cloud servers

---

## 📁 Project Structure

rubber_yolo/
│
├── backend/
│ ├── app.py # Flask app
│ ├── weights/best.pt # Trained YOLOv8 model
│ └── static/
│ ├── uploads/ # Uploaded images
│ └── predictions/ # YOLOv8 output images
│
├── frontend/
│ ├── UploadImage.jsx # React component
│ ├── index.js, App.js # React root files
│ ├── UploadImage.css # Styling
│ └── Dockerfile # Nginx setup
│
├── docker-compose.yml
└── README.md


 






