import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ListingsSection from '../components/ListingsSection'; // For Roommates
import PropertyCard from '../components/PropertyCard'; // For Properties
import Footer from '../components/Footer';
import axios from '@/api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Fallback Featured Properties (if API fails or user logged out without location)
// It's better to fetch these from backend, but keep a small fallback
const fallbackFeaturedProperties = [
    // Add 1-2 sample property objects here if you want a visual fallback
    // Example:
    // { _id: "prop1", title: "Sample Room", location: "Anytown", rent: 5000, bedrooms: 1, bathrooms: 1, photos: [], propertyType: "Room", availableFrom: new Date() },
];

const Home = () => {
  // State for Roommates
  const [roommateListings, setRoommateListings] = useState([]);
  const [roommateTitle, setRoommateTitle] = useState("Featured Roommates");
  const [isLoadingRoommates, setIsLoadingRoommates] = useState(true);

  // State for Properties
  const [propertyListings, setPropertyListings] = useState(fallbackFeaturedProperties.slice(0, 6)); // Initialize with fallback
  const [propertyTitle, setPropertyTitle] = useState("Featured Properties");
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth context to load
    if (authLoading) {
      setIsLoadingRoommates(true);
      setIsLoadingProperties(true);
      return;
    }

    const fetchAllListings = async () => {
      setIsLoadingRoommates(true);
      setIsLoadingProperties(true);

      try {
        // --- Fetch Roommates ---
        if (user && user.location) {
          setRoommateTitle(`Roommates Near ${user.location.split(',')[0]}`);
          const roommateParams = new URLSearchParams({ location: user.location, limit: 6 });
          const roommateRes = await axios.get(`/user/search?${roommateParams.toString()}`);
          if (roommateRes.data.length > 0) {
            setRoommateListings(roommateRes.data);
          } else {
            // No roommates nearby, fetch featured instead
             setRoommateTitle("Featured Roommates");
             const featuredRoommatesRes = await axios.get('/user/featured?limit=6'); // Assuming a featured route exists
             setRoommateListings(featuredRoommatesRes.data);
          }
        } else {
          // Logged out: Fetch featured roommates
          setRoommateTitle("Featured Roommates");
          // Ensure your backend has a /user/featured route similar to properties/featured
          // For now, let's assume it exists and handles limit
          const featuredRoommatesRes = await axios.get('/user/featured?limit=6');
          setRoommateListings(featuredRoommatesRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch roommate listings", err);
        setRoommateTitle("Featured Roommates");
        // Use a static fallback if API fails? For now, empty.
        setRoommateListings([]);
      } finally {
        setIsLoadingRoommates(false);
      }

      try {
        // --- Fetch Properties ---
        if (user && user.location) {
          setPropertyTitle(`Properties Near ${user.location.split(',')[0]}`);
          const propertyParams = new URLSearchParams({ location: user.location, limit: 6 });
          const propertyRes = await axios.get(`/properties/search?${propertyParams.toString()}`);
           if (propertyRes.data.length > 0) {
              setPropertyListings(propertyRes.data);
           } else {
             // No properties nearby, fetch featured instead
             setPropertyTitle("Featured Properties");
             const featuredPropsRes = await axios.get('/properties/search?limit=6'); // Fetch any 6 properties
             setPropertyListings(featuredPropsRes.data);
           }
        } else {
          // Logged out: Fetch featured properties
          setPropertyTitle("Featured Properties");
          const featuredPropsRes = await axios.get('/properties/search?limit=6'); // Fetch any 6 properties
          setPropertyListings(featuredPropsRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch property listings", err);
        setPropertyTitle("Featured Properties");
        setPropertyListings(fallbackFeaturedProperties.slice(0, 6)); // Use static fallback on error
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchAllListings();

  }, [user, authLoading]); // Re-run when auth state changes

  return (
    <div>
      <Hero />

      {/* --- Roommate Listings Section --- */}
      {isLoadingRoommates ? (
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        // Pass roommate data to ListingsSection
        <ListingsSection
          listings={roommateListings}
          title={roommateTitle}
        />
      )}

      {/* --- NEW Property Listings Section --- */}
      <section id="property-listings" className="py-16 bg-secondary/30"> {/* Different background */}
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold mb-4">{propertyTitle}</h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               Discover rooms and apartments available now.
             </p>
           </div>

           {isLoadingProperties ? (
              <div className="flex justify-center items-center py-20 min-h-[300px]">
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
           ) : propertyListings.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                 No properties found matching your criteria right now.
              </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {propertyListings.map((prop) => (
                 <PropertyCard key={prop._id} property={prop} />
               ))}
             </div>
           )}
         </div>
      </section>
      {/* --- END NEW Section --- */}

      <Footer />
    </div>
  );
}

export default Home;