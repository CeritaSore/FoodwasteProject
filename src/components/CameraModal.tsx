import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface CameraModalProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop all tracks of the stream
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // 90% quality
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg relative overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close camera"
          className="absolute top-3 right-3 text-white bg-black/50 rounded-full p-2 z-20"
        >
          <Icon name="close" className="h-6 w-6" />
        </button>

        {error ? (
          <div className="p-8 text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto max-h-[70vh] object-cover"
          />
        )}
        
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
            <button
                onClick={handleCapture}
                disabled={!!error}
                aria-label="Capture photo"
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30 disabled:bg-gray-500"
            >
                <div className="w-[68px] h-[68px] rounded-full bg-white ring-2 ring-gray-900"></div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;