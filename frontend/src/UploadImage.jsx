import React, { useState } from 'react';
import './UploadImage.css';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append('image', image);

    try {
      // ✅ Use relative path to avoid localhost issues in Docker/AWS
      const res = await fetch('/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (data.prediction_path) {
        setResultUrl(data.prediction_path); // already includes /static path
      } else {
        setError('Prediction failed. Try again.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Server Error: Unable to connect.');
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="plantation-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="title-wrapper">
          <span className="tree-icon bounce-1">🌲</span>
          <h1 className="plantation-title">Rubber Tree Segmentation</h1>
          <span className="tree-icon bounce-2">🌲</span>
        </div>
        <p className="subtitle">
          Upload your plantation images and get AI-powered segmentation analysis with our advanced machine learning model
        </p>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-box">
          <div className="upload-content">
            <div className="upload-icon-wrapper">
              <div className="upload-icon">📤</div>
              <div className="ping-dot"></div>
            </div>

            <div className="upload-text">
              <h3>Upload Your Plantation Image</h3>
              <p>Drag and drop or click to select your rubber tree image</p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="choose-button">
              🖼️ Choose Image
            </label>

            {loading && (
              <div className="progress-section">
                <div className="progress-info">
                  <span className="spinner">⚡</span>
                  <span>Processing... {uploadProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {image && !loading && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="analyze-button pulse-animation"
              >
                🚀 Analyze Image
              </button>
            )}

            {error && (
              <div className="error-message shake-animation">
                ⚠️ <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(preview || resultUrl) && (
        <div className="results-section">
          {preview && (
            <div className="image-container original-image">
              <div className="image-header">
                <div className="icon-badge blue-badge">📤</div>
                <h3>Original Image</h3>
              </div>
              <div className="image-wrapper">
                <img src={preview} alt="Original" />
                <div className="image-overlay"></div>
              </div>
            </div>
          )}

          {resultUrl && (
            <div className="image-container result-image glow-animation">
              <div className="image-header">
                <div className="icon-badge green-badge pulse-badge">✅</div>
                <h3>Segmentation Result</h3>
                <div className="loading-dots">
                  <div className="dot dot-1"></div>
                  <div className="dot dot-2"></div>
                  <div className="dot dot-3"></div>
                </div>
              </div>
              <div className="image-wrapper rainbow-border">
                <img src={resultUrl} alt="Segmentation Result" />
                <div className="image-overlay green-overlay"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="footer-section">
        <div className="footer-badge">
          <span className="tree-icon">🌲</span>
          <span>Powered by Advanced AI Segmentation</span>
          <span className="tree-icon">🌲</span>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
