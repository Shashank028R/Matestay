import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import Footer from '@/components/Footer';
import { Loader2, MapPin, Bath, BedDouble, CalendarDays, IndianRupee, Wifi, Utensils, ParkingCircle, Snowflake, ChevronLeft, User, MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const placeholderImage = "https://via.placeholder.com/800x600.png?text=No+Image";
const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

// Amenity Icons
const amenityIcons = {
  Wifi: <Wifi className="h-5 w-5 text-primary" />,
  Kitchen: <Utensils className="h-5 w-5 text-primary" />,
  Parking: <ParkingCircle className="h-5 w-5 text-primary" />,
  AC: <Snowflake className="h-5 w-5 text-primary" />,
  // Add more as needed
};

// Loader Component
const Loader = () => (
    <div className="flex justify-center items-center h-screen pt-20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
);

// Not Found Component
const NotFound = () => (
    <div className="flex flex-col min-h-screen">
        <div className="pt-24 flex-grow bg-background text-center py-20">
            <h1 className="text-3xl font-bold">Property Not Found</h1>
            <p className="text-muted-foreground mt-4">The listing you are looking for does not exist or could not be loaded.</p>
            <Button asChild className="mt-6 bg-[#5b5dda] hover:bg-[#4a4ab5]">
                <Link to="/properties">Back to Listings</Link>
            </Button>
        </div>
        <Footer />
    </div>
);


const PropertyDetailPage = () => {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(''); // <-- NEW STATE FOR SELECTED IMAGE
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch property and initialize selectedImage
  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      setProperty(null);
      setSelectedImage(''); // Reset selected image on new property fetch
      try {
        const propResponse = await axios.get(`/properties/${id}`);
        setProperty(propResponse.data);
        // Set the first photo as the selected one, or the placeholder
        if (propResponse.data.photos && propResponse.data.photos.length > 0) {
          setSelectedImage(propResponse.data.photos[0]);
        } else {
          setSelectedImage(placeholderImage);
        }
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setProperty(null);
        setSelectedImage(placeholderImage); // Fallback on error
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProperty();
    else setIsLoading(false);
  }, [id]);

  // Handle Contact Lister button click
  const handleContactLister = async () => {
    if (!user) {
      alert("Please log in to contact the lister.");
      return;
    }
    if (!property || !property.lister || !property.lister._id) {
        alert("Lister information is unavailable.");
        return;
    }
     if (property.lister._id === user._id) {
        alert("You cannot start a chat with yourself.");
        return;
    }
    try {
      const res = await axios.post("/conversations", {
        receiverId: property.lister._id,
      });
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error("Failed to start conversation", err);
      alert("Could not start chat. Please try again later.");
    }
  };

  // Render Loading or Not Found states
  if (isLoading) return <Loader />;
  if (!property) return <NotFound />;

  // Destructure property data
  const {
    title, description, propertyType, location, rent, bedrooms, bathrooms,
    amenities = [], photos = [], availableFrom, lister
  } = property;
  // Use the photos array directly, as selectedImage will handle the current display
  const displayPhotos = photos.length > 0 ? photos : [placeholderImage];


  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/properties" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Listings
          </Link>

          {/* --- Flipkart-Style Layout --- */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

            {/* --- Left Column: Image(s) --- */}
            <div className="md:col-span-5 lg:col-span-5">
              <div className="sticky top-28">
                {/* Main large image */}
                <img
                  src={selectedImage} // <-- USE selectedImage HERE
                  alt={title}
                  className="w-full h-auto object-cover aspect-[4/3] rounded-lg border border-border shadow-sm bg-muted"
                />
                {/* Thumbnail images */}
                {displayPhotos.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {displayPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${title} thumbnail ${index + 1}`}
                        className={`w-16 h-16 object-cover rounded border-2 cursor-pointer 
                                    ${photo === selectedImage ? 'border-primary' : 'border-border hover:border-muted-foreground'}`} // <-- Highlight selected
                        onClick={() => setSelectedImage(photo)} // <-- SET selectedImage ON CLICK
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* --- Center Column: Details --- */}
            <div className="md:col-span-7 lg:col-span-4">
              <Badge variant="secondary" className="mb-2">{propertyType}</Badge>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h1>
              <p className="flex items-center gap-1 text-md text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" /> {location}
              </p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">₹{rent.toLocaleString()}</span>
                <span className="text-muted-foreground"> / month</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-6 border-b border-border pb-6">
                 <span className="flex items-center gap-1 text-foreground">
                   <BedDouble className="h-5 w-5 text-muted-foreground"/> {bedrooms} Bed{bedrooms !== 1 ? 's' : ''}
                 </span>
                 <span className="flex items-center gap-1 text-foreground">
                   <Bath className="h-5 w-5 text-muted-foreground"/> {bathrooms} Bath{bathrooms !== 1 ? 's' : ''}
                 </span>
                 <span className="flex items-center gap-1 text-foreground">
                   <CalendarDays className="h-5 w-5 text-muted-foreground"/> Available: {new Date(availableFrom).toLocaleDateString()}
                 </span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground text-sm whitespace-pre-line">{description}</p>
              </div>

              {amenities.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        {amenityIcons[amenity] || <span className="text-primary">•</span>}
                        <span className="text-muted-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* --- Right Column: Lister & Actions --- */}
            <div className="md:col-span-12 lg:col-span-3">
              <div className="sticky top-28 bg-card border border-border rounded-lg p-6 shadow-sm">
                 <h2 className="text-lg font-semibold mb-4">Listed By</h2>
                 <div className="flex items-center gap-3 mb-4">
                   <img src={lister?.profilePic || defaultAvatar} alt={lister?.name || 'Lister'} className="w-12 h-12 rounded-full object-cover" />
                   <div>
                     <p className="font-semibold text-md">{lister?.name || 'Unknown Lister'}</p>
                   </div>
                 </div>

                 <Button
                    onClick={handleContactLister}
                    disabled={!user || user?._id === lister?._id}
                    className="w-full bg-[#5b5dda] text-white hover:bg-[#4a4ab5] rounded-lg text-md py-3"
                 >
                   <MessageSquare className="h-5 w-5 mr-2" />
                   {user?._id === lister?._id ? "This is your listing" : "Chat with Lister"}
                 </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;