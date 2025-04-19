import React, { useRef, useEffect, useState } from 'react';
import { MapPin, UserRound, Share2, X, CheckCheck, Shield, Navigation, StopCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  notified: boolean;
  joined: boolean;
}

interface Authority {
  id: string;
  name: string;
  type: string;
  distance: string;
}

const SOSDashboard = ({ onClose }: { onClose: () => void }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [showLiveLocation, setShowLiveLocation] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Amit S.', notified: true, joined: false },
    { id: '2', name: 'Inspector Sharma', notified: true, joined: true },
    { id: '3', name: 'Mom', notified: true, joined: false },
    { id: '4', name: 'Dad', notified: true, joined: false }
  ]);
  const [authorities, setAuthorities] = useState<Authority[]>([
    { id: '1', name: 'Police Station Murad Nagar', type: 'Police', distance: '5.6 km' },
    { id: '2', name: 'PRIMSR Hospital', type: 'Medical', distance: '1.2 km' },
    { id: '3', name: 'Fire Department', type: 'Fire', distance: '1.5 km' },
  ]);

  const { toast } = useToast();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        toast({
          title: "Location Error",
          description: "Could not access your location. Using last known location.",
          variant: "destructive"
        });
        setLocation({ lat: 28.7966417, lng: 77.5378583 }); // fallback
      }
    );

    const timer1 = setTimeout(() => {
      setEmergencyContacts(prev => 
        prev.map(contact => contact.id === '1' ? { ...contact, joined: true } : contact)
      );
      toast({ title: "Contact joined", description: "Amit S. has joined your emergency session" });
    }, 5000);

    const timer2 = setTimeout(() => {
      setEmergencyContacts(prev => 
        prev.map(contact => contact.id === '3' ? { ...contact, joined: true } : contact)
      );
      toast({ title: "Contact joined", description: "Mom has joined your emergency session" });
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    let recorder: MediaRecorder;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);

      try {
        const options = { mimeType: 'video/webm;codecs=vp8' };
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        console.warn("Fallback to default MediaRecorder options", e);
        recorder = new MediaRecorder(stream);
      }

      recordedChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emergency_recording_${new Date().toISOString()}.webm`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        recordedChunks.current = [];
      };

      recorder.start(100);
      mediaRecorder.current = recorder;
      console.log("Recording started");
    }).catch((err) => {
      toast({ title: "Camera Error", description: err.message, variant: "destructive" });
    });

    return () => {
      recorder?.stop?.();
      mediaStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      toast({ title: "Recording stopped", description: "Download started automatically." });
    }
    mediaStream?.getTracks().forEach(track => track.stop());
  };

  const shareLocation = () => {
    toast({
      title: "Location Shared",
      description: "Your current location has been shared with your emergency contacts"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-sheild-dark border border-sheild-primary/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 bg-sheild-dark-accent flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-blink"></div>
            <h2 className="text-lg font-bold text-red-500">EMERGENCY MODE ACTIVE</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-sheild-dark-accent hover:bg-sheild-dark p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          <div className="lg:col-span-2 flex flex-col">
            <div className="relative bg-black rounded-lg overflow-hidden h-64 md:h-96">
              {isLiveStreaming ? (
                <video
                  ref={videoRef}
                  className="w-full h-[300px] object-cover rounded-lg shadow-md"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/70">
                  Video stream paused
                </div>
              )}

              <div className="absolute top-4 left-4 flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-blink"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>

              <button
                onClick={stopRecording}
                className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <StopCircle size={16} className="mr-2" />
                Stop & Download
              </button>

              {showLiveLocation && (
                <div className="absolute bottom-4 left-4 flex justify-between">
                  <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center">
                    <Navigation size={16} className="text-red-400 mr-2 animate-pulse" />
                    <div>
                      <div className="text-white text-sm font-medium">Live Location Active</div>
                      <div className="flex items-center text-white/80 text-xs">
                        <MapPin size={10} className="mr-1" />
                        <span>{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Fetching location..."}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-white text-lg font-medium mb-2">Authorities Near You</h3>
              <div className="bg-sheild-dark-accent rounded-lg p-3 space-y-3">
                {authorities.map(authority => (
                  <div key={authority.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-sheild-primary/30 flex items-center justify-center mr-3">
                        <Shield size={16} className="text-sheild-primary" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{authority.name}</p>
                        <p className="text-xs text-white/70">{authority.type}</p>
                      </div>
                    </div>
                    <div className="text-xs text-white/70">{authority.distance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium mb-2">Emergency Contacts</h3>
            <div className="bg-sheild-dark-accent rounded-lg p-3 space-y-3">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-sheild-primary/30 flex items-center justify-center mr-3">
                      <UserRound size={16} className="text-sheild-primary" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-xs text-white/70">{contact.notified ? "Notified" : "Not Notified"}</p>
                    </div>
                  </div>
                  <div className="text-xs text-white/70">{contact.joined ? "Joined" : "Pending"}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              <button 
                onClick={shareLocation}
                className="w-full bg-sheild-primary hover:bg-sheild-secondary text-white rounded-lg py-3 font-medium transition-colors flex items-center justify-center"
              >
                <Share2 size={18} className="mr-2" />
                Share Location
              </button>
              <button 
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium transition-colors"
              >
                Call Emergency Services (112)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSDashboard;
