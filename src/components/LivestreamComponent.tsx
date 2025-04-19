
import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LivestreamComponentProps {
  isActive: boolean;
  onClose: () => void;
}

const LivestreamComponent: React.FC<LivestreamComponentProps> = ({ 
  isActive,
  onClose
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Start streaming when component becomes active
    if (isActive && !isStreaming) {
      startStream();
    }
    
    // Clean up stream when component is unmounted or becomes inactive
    return () => {
      stopStream();
    };
  }, [isActive]);

  const startStream = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setIsStreaming(true);
      
      toast({
        title: "Livestream Started",
        description: "Your emergency contacts can now see your video feed",
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage("Could not access camera or microphone");
      setIsStreaming(false);
      
      toast({
        title: "Livestream Error",
        description: "Failed to access camera or microphone",
        variant: "destructive"
      });
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const toggleStream = () => {
    if (isStreaming) {
      stopStream();
      toast({
        title: "Livestream Paused",
        description: "Your video feed has been paused"
      });
    } else {
      startStream();
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      
      setIsMuted(!isMuted);
      
      toast({
        title: isMuted ? "Microphone Enabled" : "Microphone Disabled",
        description: isMuted ? "Others can hear you now" : "Others cannot hear you now"
      });
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-sheild-dark border border-sheild-primary/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 bg-sheild-primary flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-blink"></div>
            <h2 className="text-lg font-bold text-white">LIVE STREAMING</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-sheild-primary/80 hover:bg-sheild-primary p-1 rounded"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="relative bg-black w-full aspect-video">
          {isStreaming ? (
            <>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-blink"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              {errorMessage ? (
                <div className="text-center">
                  <p className="text-red-400 mb-2">{errorMessage}</p>
                  <button 
                    onClick={startStream}
                    className="bg-sheild-primary hover:bg-sheild-secondary text-white py-2 px-4 rounded-lg text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <p className="text-white/70">Video stream paused</p>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 flex items-center justify-center space-x-4">
          <button 
            onClick={toggleStream}
            className={`p-3 rounded-full flex items-center justify-center ${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isStreaming ? (
              <VideoOff size={24} className="text-white" />
            ) : (
              <Video size={24} className="text-white" />
            )}
          </button>
          
          <button 
            onClick={toggleMute}
            className="p-3 rounded-full bg-sheild-dark-accent hover:bg-sheild-dark-accent/70 flex items-center justify-center"
          >
            {isMuted ? (
              <MicOff size={24} className="text-white" />
            ) : (
              <Mic size={24} className="text-white" />
            )}
          </button>
        </div>
        
        <div className="p-4 bg-sheild-dark-accent">
          <p className="text-white/80 text-center text-sm">
            Your emergency contacts are being notified of this livestream
          </p>
        </div>
      </div>
    </div>
  );
};

export default LivestreamComponent;
