import React, { useState } from 'react';
import { Car, Clock, MapPin, X, Bus, Footprints } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GuardianAIDashboard from './GuardianAIDashboard';

type TravelMode = 'cab' | 'public' | 'walking';

interface BaseTripDetails {
  duration: string;
  destination: string;
  mode: TravelMode | null;
}

interface CabTripDetails extends BaseTripDetails {
  mode: 'cab';
  carNumber: string;
  driverName: string;
  driverNumber: string;
}

interface PublicTransportTripDetails extends BaseTripDetails {
  mode: 'public';
  startLocation: string;
}

interface WalkingTripDetails extends BaseTripDetails {
  mode: 'walking';
  startLocation: string;
}

type TripDetails = CabTripDetails | PublicTransportTripDetails | WalkingTripDetails;

const TripStatusBar: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTripActive, setIsTripActive] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode | null>(null);
  const [tripDetails, setTripDetails] = useState<Partial<BaseTripDetails>>({
    mode: null,
    duration: "",
    destination: "",
  });
  const [showGuardianAI, setShowGuardianAI] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTripDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTravelModeSelect = (mode: TravelMode) => {
    setTravelMode(mode);
    setTripDetails(prev => ({
      ...prev,
      mode
    }));
  };

  const startTrip = () => {
    // Validate trip details based on travel mode
    if (travelMode === 'cab') {
      if (!tripDetails.destination || !tripDetails.duration || 
          !(tripDetails as any).carNumber || !(tripDetails as any).driverName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required trip details",
          variant: "destructive"
        });
        return;
      }
    } else if (travelMode === 'public' || travelMode === 'walking') {
      if (!tripDetails.destination || !tripDetails.duration || 
          !(tripDetails as any).startLocation) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required trip details",
          variant: "destructive"
        });
        return;
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please select a travel mode",
        variant: "destructive"
      });
      return;
    }

    setIsTripActive(true);
    setIsDialogOpen(false);
    setShowGuardianAI(true); // Open Guardian AI chat
    toast({
      title: "Trip Started",
      description: "Your emergency contacts will be notified of your trip"
    });
  };

  const endTrip = () => {
    setIsTripActive(false);
    setTravelMode(null);
    setShowGuardianAI(false); // Close Guardian AI chat
    setTripDetails({
      mode: null,
      duration: "",
      destination: "",
    });
    toast({
      title: "Trip Ended",
      description: "Your trip has been marked as completed"
    });
  };

  const getTravelModeIcon = () => {
    switch (travelMode) {
      case 'cab':
        return <Car size={isMobile ? 18 : 20} className="text-sheild-primary mr-2" />;
      case 'public':
        return <Bus size={isMobile ? 18 : 20} className="text-sheild-primary mr-2" />;
      case 'walking':
        return <Footprints size={isMobile ? 18 : 20} className="text-sheild-primary mr-2" />;
      default:
        return <Car size={isMobile ? 18 : 20} className="text-sheild-primary mr-2" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className={`w-full glass-card ${isTripActive ? 'bg-sheild-primary/20' : 'bg-sheild-dark-accent/70'} rounded-xl p-3 mb-4 transition-all flex items-center justify-between`}
      >
        <div className="flex items-center">
          {isTripActive ? getTravelModeIcon() : <Car size={isMobile ? 18 : 20} className="text-sheild-primary mr-2" />}
          <div>
            <h3 className="text-white text-sm font-medium">
              {isTripActive ? 'Trip in Progress' : 'Start a Trip'}
            </h3>
            {isTripActive && tripDetails.destination && (
              <p className="text-white/70 text-xs flex items-center">
                <MapPin size={12} className="mr-1" />
                {tripDetails.destination}
              </p>
            )}
          </div>
        </div>
        
        {isTripActive && (
          <div className="flex items-center">
            <div className="bg-sheild-primary/30 rounded-full px-2 py-0.5 text-white text-xs flex items-center">
              <Clock size={12} className="mr-1" />
              {tripDetails.duration || 'In progress'}
            </div>
          </div>
        )}
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-sheild-dark border border-sheild-primary/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isTripActive ? 'Current Trip' : 'Trip Details'}
            </DialogTitle>
          </DialogHeader>
          
          {!isTripActive && !travelMode && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-center text-white/80">Select your travel mode:</p>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => handleTravelModeSelect('cab')}
                  className="flex flex-col items-center justify-center p-4 border border-sheild-primary/20 rounded-md hover:bg-sheild-primary/10 transition-colors"
                >
                  <Car size={24} className="text-sheild-primary mb-2" />
                  <span className="text-sm">Cab</span>
                </button>
                <button 
                  onClick={() => handleTravelModeSelect('public')}
                  className="flex flex-col items-center justify-center p-4 border border-sheild-primary/20 rounded-md hover:bg-sheild-primary/10 transition-colors"
                >
                  <Bus size={24} className="text-sheild-primary mb-2" />
                  <span className="text-sm">Public Transport</span>
                </button>
                <button 
                  onClick={() => handleTravelModeSelect('walking')}
                  className="flex flex-col items-center justify-center p-4 border border-sheild-primary/20 rounded-md hover:bg-sheild-primary/10 transition-colors"
                >
                  <Footprints size={24} className="text-sheild-primary mb-2" />
                  <span className="text-sm">Walking</span>
                </button>
              </div>
            </div>
          )}
          
          {!isTripActive && travelMode && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/80">
                  Travel mode: {travelMode === 'cab' ? 'Cab' : travelMode === 'public' ? 'Public Transport' : 'Walking'}
                </p>
                <button 
                  onClick={() => setTravelMode(null)}
                  className="text-sheild-primary hover:text-sheild-secondary text-sm"
                >
                  Change
                </button>
              </div>
              
              {travelMode === 'cab' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="carNumber" className="text-sm text-white/80">
                      Car Number / Model
                    </label>
                    <input 
                      id="carNumber"
                      name="carNumber"
                      value={(tripDetails as any).carNumber || ''}
                      onChange={handleInputChange}
                      className="w-full bg-sheild-dark-accent border border-sheild-primary/20 rounded-md p-2 text-white"
                      placeholder="e.g., AB12 XYZ or Toyota Camry"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="driverName" className="text-sm text-white/80">
                      Driver Name
                    </label>
                    <input 
                      id="driverName"
                      name="driverName"
                      value={(tripDetails as any).driverName || ''}
                      onChange={handleInputChange}
                      className="w-full bg-sheild-dark-accent border border-sheild-primary/20 rounded-md p-2 text-white"
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="driverNumber" className="text-sm text-white/80">
                      Driver Number
                    </label>
                    <input 
                      id="driverNumber"
                      name="driverNumber"
                      value={(tripDetails as any).driverNumber || ''}
                      onChange={handleInputChange}
                      className="w-full bg-sheild-dark-accent border border-sheild-primary/20 rounded-md p-2 text-white"
                      placeholder="e.g., +1 234 567 8900"
                    />
                  </div>
                </>
              )}
              
              {(travelMode === 'public' || travelMode === 'walking') && (
                <div className="space-y-2">
                  <label htmlFor="startLocation" className="text-sm text-white/80">
                    Start Location
                  </label>
                  <input 
                    id="startLocation"
                    name="startLocation"
                    value={(tripDetails as any).startLocation || ''}
                    onChange={handleInputChange}
                    className="w-full bg-sheild-dark-accent border border-sheild-primary/20 rounded-md p-2 text-white"
                    placeholder="e.g., 123 Main St, City"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="destination" className="text-sm text-white/80">
                  Destination
                </label>
                <input 
                  id="destination"
                  name="destination"
                  value={tripDetails.destination || ''}
                  onChange={handleInputChange}
                  className="w-full bg-sheild-dark-accent border border-sheild-primary/20 rounded-md p-2 text-white"
                  placeholder="e.g., 123 Main St, City"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm text-white/80">
                  Estimated Duration
                </label>
                <input 
                  id="duration"
                  name="duration"
                  value={tripDetails.duration || ''}
                  onChange={handleInputChange}
                  className="w-full bg-sheild-dark-accent border border-sheild-primary/20 rounded-md p-2 text-white"
                  placeholder="e.g., 30 minutes"
                />
              </div>
            </div>
          )}
          
          {isTripActive && (
            <div className="space-y-4 py-2">
              {travelMode === 'cab' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/80">Car Number:</span>
                    <span className="text-sm text-white">{(tripDetails as any).carNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/80">Driver:</span>
                    <span className="text-sm text-white">{(tripDetails as any).driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/80">Driver Number:</span>
                    <span className="text-sm text-white">{(tripDetails as any).driverNumber}</span>
                  </div>
                </>
              )}
              
              {(travelMode === 'public' || travelMode === 'walking') && (
                <div className="flex justify-between">
                  <span className="text-sm text-white/80">Start Location:</span>
                  <span className="text-sm text-white">{(tripDetails as any).startLocation}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-sm text-white/80">Destination:</span>
                <span className="text-sm text-white">{tripDetails.destination}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-white/80">Duration:</span>
                <span className="text-sm text-white">{tripDetails.duration}</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {isTripActive ? (
              <Button 
                variant="destructive"
                onClick={endTrip}
                className="w-full"
              >
                End Trip
              </Button>
            ) : (
              <Button 
                className="w-full bg-sheild-primary hover:bg-sheild-secondary text-white"
                onClick={startTrip}
                disabled={!travelMode}
              >
                Start Trip
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GuardianAIDashboard 
        isOpen={showGuardianAI} 
        onClose={() => setShowGuardianAI(false)}
      />
    </>
  );
};

export default TripStatusBar;