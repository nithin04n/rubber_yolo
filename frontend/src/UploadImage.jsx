import React, { useState, useEffect } from 'react';
import './UploadImage.css';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Floating particles animation state
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResultUrl(null);
    setError(null);
    setUploadProgress(0);
    setAnalysisComplete(false);
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setAnalysisComplete(false);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (data.prediction_path) {
        const imageUrl = `http://localhost:5000${data.prediction_path}?t=${Date.now()}`;
        setResultUrl(imageUrl);
        setAnalysisComplete(true);
      } else {
        setError('Analysis failed. Please try again with a different image.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Connection failed. Please ensure the server is running.');
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setPreview(null);
    setResultUrl(null);
    setError(null);
    setUploadProgress(0);
    setAnalysisComplete(false);
  };

  return (
    <div className="app-container">
      {/* Floating Particles Background */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🌿</div>
            <div className="logo-text">
              <h1>Customized Rubber Plant Detection</h1>
              <span>Smart Detection</span>
            </div>
          </div>
          <nav className="nav-menu">
            <a href="#" className="nav-item active">Detect</a>
            <a href="#" className="nav-item">About</a>
            <a href="#" className="nav-item">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-text">
            <h2 className="hero-title">
              AI-Powered Rubber Tree
              <span className="gradient-text"> Detection</span>
            </h2>
            <p className="hero-subtitle">
              Advanced computer vision for precise plantation analysis and tree segmentation
            </p>
            
          </div>

          <div className="upload-section">
            <div className="upload-container">
              {!preview ? (
                <div 
                  className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15L12 2M12 2L8 6M12 2L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" opacity="0.5"/>
                    </svg>
                  </div>
                  <h3>Drop your image here</h3>
                  <p>or click to browse files</p>
                  <label className="upload-btn">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    Choose File
                  </label>
                  <span className="file-types">PNG, JPG, JPEG up to 10MB</span>
                </div>
              ) : (
                <div className="preview-container">
                  <div className="image-preview">
                    <img src={preview} alt="Preview" />
                    <div className="image-overlay">
                      <button className="change-btn" onClick={resetAnalysis}>
                        Change Image
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {image && !loading && !analysisComplete && (
                <button className="analyze-btn" onClick={handleUpload}>
                  <span className="btn-text">Analyze Image</span>
                  <div className="btn-icon">🔍</div>
                </button>
              )}

              {loading && (
                <div className="progress-container">
                  <div className="progress-ring">
                    <svg className="progress-svg" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" stroke="#e0e0e0" strokeWidth="8" fill="none"/>
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="54" 
                        stroke="url(#gradient)" 
                        strokeWidth="8" 
                        fill="none"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 54}`,
                          strokeDashoffset: `${2 * Math.PI * 54 * (1 - uploadProgress / 100)}`,
                          transition: 'stroke-dashoffset 0.5s ease'
                        }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00c9ff"/>
                          <stop offset="100%" stopColor="#92fe9d"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="progress-text">
                      <span className="progress-number">{Math.round(uploadProgress)}%</span>
                      <span className="progress-label">Analyzing</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {(preview || resultUrl) && (
          <section className="results-section">
            <h3 className="section-title">Analysis Results</h3>
            <div className="results-grid">
              {preview && (
                <div className="result-card original">
                  <div className="card-header">
                    <h4>Original Image</h4>
                    <div className="card-badge">📷 Input</div>
                  </div>
                  <div className="card-image">
                    <img src={preview} alt="Original" />
                  </div>
                </div>
              )}

              {resultUrl && (
                <div className="result-card segmented">
                  <div className="card-header">
                    <h4>Segmentation Result</h4>
                    <div className="card-badge success">✅ Detected</div>
                  </div>
                  <div className="card-image">
                    <img src={resultUrl} alt="Segmented" className="fade-in" />
                  </div>
                  <div className="card-footer">
                    <div className="detection-stats">
                      <span className="stat">Trees detected</span>
                      <span className="stat">Confidence: High</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>🏆 Built for National Hackathon • Powered by Advanced AI</p>
          <div className="footer-links">
            <a href="#">Privacy</a> • <a href="#">Terms</a> • <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UploadImage;
