import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MultiStepProfile from "../components/MultiStepProfile";
import ViewProfile from "../components/ViewProfile";

export default function Profile() {
  const { user, refreshUser, loading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs when the user's data or loading state changes
    if (loading) {
      return; // Still loading, wait
    }

    if (!user) {
      // Not logged in, redirect to home
      navigate("/");
      return;
    }

    // --- THIS IS THE CORE LOGIC ---
    if (user.profileSetupComplete === false) {
      // If setup is NOT complete, force them into editing mode.
      setIsEditing(true);
    } else {
      // If setup IS complete, show them their profile.
      setIsEditing(false);
    }
    
  }, [user, loading, navigate]); // Rerun when these change

  
  // This function is passed to the MultiStepProfile component
  const handleSaveProfile = async () => {
    // 1. Refresh user data from backend (this gets the new `profileSetupComplete: true`)
    await refreshUser();
    // 2. Switch from editing mode back to view mode
    setIsEditing(false); 
  };

  // This function is passed to the ViewProfile component
  const handleEditProfile = () => {
    setIsEditing(true); // Switch to editing mode
  };


  // --- RENDER LOGIC ---

  if (loading || !user) {
    // Show a loading spinner or blank page while logic runs
    return (
      <div className="pt-32 text-center text-muted-foreground">
        Loading Profile...
      </div>
    );
  }

  // We are logged in, now decide what to show
  return (
    <div className="container mx-auto px-4 py-12 pt-28"> 
      {/* pt-28 added to account for your fixed navbar */}
      
      {isEditing ? (
        // RENDER 1: The Multi-Step Edit Form
        <MultiStepProfile 
          initialData={user} 
          onSaved={handleSaveProfile} 
        />
      ) : (
        // RENDER 2: The "View Profile" Component
        <ViewProfile 
          user={user} 
          onEdit={handleEditProfile} 
        />
      )}
    </div>
  );
}