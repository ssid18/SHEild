
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { User, Mail, Phone, Image as ImageIcon, Edit2, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface UserDashboardProps {
  isOpen: boolean
  onClose: () => void
}

const UserDashboard = ({ isOpen, onClose }: UserDashboardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()
  const [userProfile, setUserProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.j@gmail.com",
    phone: "+91 98765 43210"
  })

  const handleProfilePhotoUpload = () => {
    toast({
      title: "Upload Started",
      description: "Please select a photo to upload"
    })
  }

  const handleSaveChanges = () => {
    setIsEditing(false)
    toast({
      title: "Changes Saved",
      description: "Your profile has been updated successfully"
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-sheild-dark border-sheild-primary/30 max-w-4xl h-[90vh]">
        <div className="flex flex-col h-full p-6 space-y-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-[#ED4EC9]/20 flex items-center justify-center">
                <User size={64} className="text-[#ED4EC9]" />
              </div>
              <Button 
                onClick={handleProfilePhotoUpload}
                className="absolute bottom-0 right-0 rounded-full p-2 bg-[#ED4EC9]"
              >
                <ImageIcon size={16} />
              </Button>
            </div>
            <span className="text-xl font-semibold text-white">Profile Photo</span>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-[#ED4EC9] text-[#ED4EC9]"
                >
                  <Edit2 size={16} className="mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-white/70">Full Name</label>
                  <Input
                    value={userProfile.name}
                    readOnly={!isEditing}
                    className="bg-sheild-dark-accent text-white"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label className="text-white/70">Email</label>
                  <Input
                    value={userProfile.email}
                    readOnly={!isEditing}
                    className="bg-sheild-dark-accent text-white"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label className="text-white/70">Phone</label>
                  <Input
                    value={userProfile.phone}
                    readOnly={!isEditing}
                    className="bg-sheild-dark-accent text-white"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <Button 
                onClick={handleSaveChanges}
                className="w-full bg-[#ED4EC9]"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserDashboard
