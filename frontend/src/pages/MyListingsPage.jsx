import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import PropertyCard from '@/components/PropertyCard'; // Reuse the card
import Footer from '@/components/Footer';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const MyListingsPage = () => {
  const [myListings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Needed for authentication check
  const navigate = useNavigate();

  // Fetch user's listings
  const fetchMyListings = async () => {
    // console.log("Frontend: fetchMyListings called"); // Keep for debugging if needed
    setIsLoading(true);
    try {
      const response = await axios.get('/properties/my-listings');
      console.log("Frontend: Received my listings:", response.data); // Keep for debugging if needed
      setMyListings(response.data);
    } catch (err) {
      console.error("Failed to fetch my listings:", err);
      // Handle error (e.g., show a message)
      setMyListings([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch listings when the component mounts or the user changes
  useEffect(() => {
    if (user) { // Only fetch if user is logged in
      fetchMyListings();
    } else {
      setIsLoading(false); // Stop loading if no user (shouldn't happen due to ProtectedRoute)
      setMyListings([]); // Clear listings if user logs out while on the page
    }
  }, [user]); // Re-fetch if user changes

  // Handle Delete button click
  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`/properties/${propertyId}`);
      // Remove the deleted listing from the state
      setMyListings(prev => prev.filter(listing => listing._id !== propertyId));
      alert("Listing deleted successfully.");
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Could not delete listing. Please try again.");
    }
  };

  // Handle Edit button click (currently navigates to a placeholder route)
  const handleEdit = (propertyId) => {
    console.log("Navigate to edit page for ID:", propertyId);
     navigate(`/properties/edit/${propertyId}`); // Placeholder for edit route
     // We will create the actual EditPropertyPage later
  };


  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Main render
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex-grow bg-background"> {/* pt-24 for navbar */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Listings</h1>
            <Button asChild className="bg-[#5b5dda] hover:bg-[#4a4ab5]">
              <Link to="/properties/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Listing
              </Link>
            </Button>
          </div>

          {/* Conditional rendering based on listings */}
          {myListings.length === 0 ? (
            // Displayed when no listings are found
            <div className="text-center py-20 bg-card border border-border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold">No Listings Found</h2>
              <p className="text-muted-foreground mt-2 mb-4">You haven't posted any properties yet.</p>
              <Button asChild>
                <Link to="/properties/new">Post Your First Listing</Link>
              </Button>
            </div>
          ) : (
            // Displayed when listings are found
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myListings.map((prop) => (
                <div key={prop._id} className="relative group">
                  {/* Reuse the PropertyCard component */}
                  <PropertyCard property={prop} />
                  {/* Edit/Delete Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                     <Button
                        size="icon"
                        variant="outline"
                        className="bg-background/80 hover:bg-accent h-8 w-8 rounded-full shadow" // Added rounded-full and shadow
                        onClick={() => handleEdit(prop._id)}
                        title="Edit Listing"
                     >
                       <Edit className="h-4 w-4" />
                     </Button>
                     <Button
                        size="icon"
                        variant="destructive"
                        className="bg-destructive/80 hover:bg-destructive h-8 w-8 rounded-full shadow" // Added rounded-full and shadow
                        onClick={() => handleDelete(prop._id)}
                        title="Delete Listing"
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyListingsPage;