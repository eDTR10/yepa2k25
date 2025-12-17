import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RotateCcw, Download, FlipHorizontal } from 'lucide-react';

import F1 from './../assets/frame1.png';
import F2 from './../assets/frame2.png';
import F3 from './../assets/frame3.png';

// Frame images - replace these paths with your actual frame image paths
const Frame1 = F1;
const Frame2 = F2;
const Frame3 = F3;


const Photobooth: React.FC = () => {
  const [photos, setPhotos] = useState<{ [key: string]: string }>({});
  const [activeFrame, setActiveFrame] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(3);
  const [cameraMode, setCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoboothRef = useRef<HTMLDivElement>(null);

  // Template 1: Original 4 frames
  const template1Frames = [
    // { id: 'frame1', position: { top: '10.4%', left: '8.4%', width: '23.2%', height: '31.5%' } },
    { id: 'frame2', position: { top: '34.2%', left: '8.4%', width: '23.2%', height: '56.3%' } },
    { id: 'frame3', position: { top: '10.4%', left: '33.3%', width: '27%', height: '81.2%' } },
    { id: 'frame4', position: { top: '10.4%', left: '62.4%', width: '29.2%', height: '48.5%' } },
  ];

  // Template 2: Two portrait frames side by side
  const template2Frames = [
    { id: 'frame1', position: { top: '0%', left: '0%', width: '28.1%', height: '66.3%' } },
    { id: 'frame2', position: { top: '0%', left: '30.1%', width: '38.9%', height: '66.3%' } },
    { id: 'frame3', position: { top: '0%', left: '72.1%', width: '28.1%', height: '66.3%' } },
  ];

  // Template 3: Single large portrait frame
  const template3Frames = [
    { id: 'frame1', position: { top: '0%', left: '0%', width: '76.3%', height: '100%' } },
  ];

  const getTemplateImage = () => {
    switch (selectedTemplate) {
      case 1:
        return Frame1;
      case 2:
        return Frame2;
      case 3:
        return Frame3;
      default:
        return Frame1;
    }
  };

  const getCurrentFrames = () => {
    switch (selectedTemplate) {
      case 1:
        return template1Frames;
      case 2:
        return template2Frames;
      case 3:
        return template3Frames;
      default:
        return template1Frames;
    }
  };

  const frames = getCurrentFrames();

  const startCamera = async () => {
    try {
      setCameraReady(false);
      setCameraMode(true);
      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode
        },
        audio: false,
      });
      
      console.log('Camera access granted');
      setStream(mediaStream);
      
      // Wait a bit for the modal to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (videoRef.current) {
        console.log('Setting video source');
        videoRef.current.srcObject = mediaStream;
        
        // Force video to be visible and playing
        videoRef.current.style.display = 'block';
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.oncanplay = () => {
              console.log('Video can play');
              resolve(true);
            };
            // Timeout after 3 seconds
            setTimeout(() => resolve(true), 3000);
          }
        });
        
        // Try to play
        try {
          await videoRef.current.play();
          console.log('Video is playing');
        } catch (e) {
          console.log('Auto-play prevented, will play on user interaction');
        }
        
        // Set camera as ready
        setCameraReady(true);
        console.log('Camera ready');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Error: ' + err);
      setCameraMode(false);
      setCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraMode(false);
    setCameraReady(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (cameraMode) {
      stopCamera();
      startCamera();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && activeFrame) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip the image horizontally for a mirror effect (optional)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        
        const imageData = canvas.toDataURL('image/png');
        setPhotos(prev => ({ ...prev, [activeFrame]: imageData }));
        stopCamera();
        setActiveFrame(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeFrame) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setPhotos(prev => ({ ...prev, [activeFrame]: imageData }));
        setActiveFrame(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (frameId: string) => {
    setPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[frameId];
      return newPhotos;
    });
  };

  const handleFrameClick = (frameId: string) => {
    if (cameraMode) return;
    setActiveFrame(frameId);
  };

  const handleCameraClick = () => {
    if (activeFrame) {
      startCamera();
    } else {
      alert('Please select a frame first by clicking on one of the white spaces.');
    }
  };

  const handleUploadClick = () => {
    if (activeFrame) {
      fileInputRef.current?.click();
    } else {
      alert('Please select a frame first by clicking on one of the white spaces.');
    }
  };

  const handleTemplateChange = (templateNum: number) => {
    setSelectedTemplate(templateNum);
    setPhotos({});
    setActiveFrame(null);
  };

  const downloadImage = async () => {
    if (!photoboothRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Set fixed canvas dimensions
      canvas.width = 1293;
      canvas.height = 1084;
      
      // Draw each photo in its frame FIRST (bottom layer)
      for (const frame of frames) {
        if (photos[frame.id]) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = photos[frame.id];
          });
          
          // Calculate frame position and size based on fixed dimensions
          const frameX = (parseFloat(frame.position.left) / 100) * canvas.width;
          const frameY = (parseFloat(frame.position.top) / 100) * canvas.height;
          const frameWidth = (parseFloat(frame.position.width) / 100) * canvas.width;
          const frameHeight = (parseFloat(frame.position.height) / 100) * canvas.height;
          
          // Calculate aspect ratios
          const imgAspect = img.width / img.height;
          const frameAspect = frameWidth / frameHeight;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          // Cover the frame (similar to object-fit: cover)
          if (imgAspect > frameAspect) {
            // Image is wider than frame
            drawHeight = frameHeight;
            drawWidth = drawHeight * imgAspect;
            offsetX = frameX - (drawWidth - frameWidth) / 2;
            offsetY = frameY;
          } else {
            // Image is taller than frame
            drawWidth = frameWidth;
            drawHeight = drawWidth / imgAspect;
            offsetX = frameX;
            offsetY = frameY - (drawHeight - frameHeight) / 2;
          }
          
          // Clip to frame boundaries
          ctx.save();
          ctx.beginPath();
          ctx.rect(frameX, frameY, frameWidth, frameHeight);
          ctx.clip();
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          ctx.restore();
        }
      }
      
      // Draw the frame background image LAST (top layer)
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = getTemplateImage();
      });
      
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `arabian-night-photobooth-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
        setIsDownloading(false);
      }, 'image/png');
      
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try taking a screenshot instead.');
      setIsDownloading(false);
    }
  };

  return (
    <div className=" relative min-h-screen pt-5 pb-10 w-screen overflow-hidden flex items-center justify-center p-0   bg-transparent">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-yellow-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg sm:text-lg" style={{ fontFamily: 'Georgia, serif' }}>
          ✨ Arabian Night Photobooth ✨
        </h1>
        <p className="text-center text-amber-200 sm:text-sm mb-6 text-lg drop-shadow-md">
          Choose a template, then click on a frame to add your photo
        </p>

        {/* Camera Modal */}
        {cameraMode && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
            {/* Animated stars background in modal */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-20 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-16 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-48 left-1/3 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/4 right-32 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-20 left-1/2 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute top-3/4 left-16 w-2 h-2 bg-yellow-200 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
            </div>
            <div className="bg-slate-900 rounded-lg p-6 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Take Photo</h2>
                <div className="flex gap-2">
                  <button
                    onClick={toggleCamera}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    type="button"
                    title="Switch Camera"
                  >
                    <FlipHorizontal className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      stopCamera();
                    }}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors z-50"
                    type="button"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Camera Preview with Frame Overlay */}
              <div className="relative w-full rounded-lg overflow-hidden bg-gray-800" style={{ aspectRatio: '1293/1084' }}>
                {/* Loading indicator */}
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-900">
                    <div className="text-white text-lg">Loading camera...</div>
                  </div>
                )}
                
                {/* Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: 'scaleX(-1)',
                    display: cameraReady ? 'block' : 'none'
                  }}
                />
                
                {/* Frame Overlay */}
                {cameraReady && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <img
                      src={getTemplateImage()}
                      alt="Frame Overlay"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Highlight the active frame area */}
                {cameraReady && activeFrame && frames.find(f => f.id === activeFrame) && (
                  <div
                    className="absolute border-4 border-amber-400"
                    style={{
                      top: frames.find(f => f.id === activeFrame)?.position.top || '0',
                      left: frames.find(f => f.id === activeFrame)?.position.left || '0',
                      width: frames.find(f => f.id === activeFrame)?.position.width || '0',
                      height: frames.find(f => f.id === activeFrame)?.position.height || '0',
                      zIndex: 5,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  />
                )}
              </div>
              
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Camera className="w-6 h-6" />
                {cameraReady ? 'Capture Photo' : 'Starting Camera...'}
              </button>
            </div>
          </div>
        )}

        {/* Template Selection */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button
            onClick={() => handleTemplateChange(1)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md border ${
              selectedTemplate === 1
                ? 'bg-gradient-to-r from-amber-500/40 to-yellow-500/40 text-white border-amber-400/70 shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-gray-800/30 text-gray-300 border-gray-600/30 hover:border-amber-400/50'
            }`}
          >
            Template 1 (4 Frames)
          </button>
          <button
            onClick={() => handleTemplateChange(2)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md border ${
              selectedTemplate === 2
                ? 'bg-gradient-to-r from-amber-500/40 to-yellow-500/40 text-white border-amber-400/70 shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-gray-800/30 text-gray-300 border-gray-600/30 hover:border-amber-400/50'
            }`}
          >
            Template 2 (2 Frames)
          </button>
          <button
            onClick={() => handleTemplateChange(3)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md border ${
              selectedTemplate === 3
                ? 'bg-gradient-to-r from-amber-500/40 to-yellow-500/40 text-white border-amber-400/70 shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-gray-800/30 text-gray-300 border-gray-600/30 hover:border-amber-400/50'
            }`}
          >
            Template 3 (1 Frame)
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button
            onClick={handleCameraClick}
            disabled={!activeFrame}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md border ${
              activeFrame
                ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 text-white border-purple-400/50 shadow-lg shadow-purple-500/20'
                : 'bg-gray-800/30 text-gray-500 cursor-not-allowed border-gray-600/30'
            }`}
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </button>
          <button
            onClick={handleUploadClick}
            disabled={!activeFrame}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md border ${
              activeFrame
                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 hover:from-emerald-500/40 hover:to-teal-500/40 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                : 'bg-gray-800/30 text-gray-500 cursor-not-allowed border-gray-600/30'
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload Photo
          </button>
          <button
            onClick={downloadImage}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md bg-gradient-to-r from-amber-500/30 to-yellow-500/30 hover:from-amber-500/40 hover:to-yellow-500/40 text-white border border-amber-400/50 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
          <button
            onClick={() => setPhotos({})}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md bg-gradient-to-r from-red-500/30 to-orange-500/30 hover:from-red-500/40 hover:to-orange-500/40 text-white border border-red-400/50 shadow-lg shadow-red-500/20"
          >
            <RotateCcw className="w-5 h-5" />
            Reset All
          </button>
        </div>

        {activeFrame && !cameraMode && (
          <div className="text-center mb-4 backdrop-blur-md bg-gradient-to-r from-amber-400/30 to-yellow-400/30 border border-amber-300/50 text-yellow-100 py-3 px-6 rounded-xl font-semibold shadow-lg shadow-amber-500/20">
            ✨ Frame selected! Choose "Take Photo" or "Upload Photo" ✨
          </div>
        )}

        {/* Photobooth Container */}
        <div
          ref={photoboothRef}
          id="photobooth-container"
          className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 border border-border/20 rounded-sm   shadow-2xl shadow-[#ff950046] overflow-hidden"
          style={{ 
            aspectRatio: '1293/1084'
          }}
        >
          {/* Photo frames - Bottom layer (z-2) */}
          {frames.map((frame) => (
            <div
              key={frame.id}
              className={`absolute overflow-hidden cursor-pointer transition-all duration-300 ${
                activeFrame === frame.id ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent' : ''
              }`}
              style={{
                top: frame.position.top,
                left: frame.position.left,
                width: frame.position.width,
                height: frame.position.height,
                zIndex: 2,
                background: photos[frame.id] 
                  ? 'transparent'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                backdropFilter: photos[frame.id] ? 'none' : 'blur(10px)',
                border: photos[frame.id] ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: photos[frame.id]
                  ? 'none'
                  : '0 8px 32px 0 rgba(139, 92, 246, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.15)',
              }}
              onClick={() => handleFrameClick(frame.id)}
            >
              {photos[frame.id] ? (
                <>
                  <img
                    src={photos[frame.id]}
                    alt={`Photo in ${frame.id}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(frame.id);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full transition-all backdrop-blur-md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                      zIndex: 1,
                    }}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div 
                    className="p-8 rounded-full backdrop-blur-md transition-all hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
                      border: '2px solid rgba(251, 191, 36, 0.3)',
                      boxShadow: '0 8px 24px rgba(251, 191, 36, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Upload className="w-10 h-10 text-amber-300" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Frame overlay - Top layer (z-10) */}
          <img
            src={getTemplateImage()}
            alt="Arabian Night Frame"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 10 }}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default Photobooth;