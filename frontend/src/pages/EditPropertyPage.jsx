import React, { useState, useEffect, useRef } from 'react';
import axios from '@/api/axiosInstance';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import { Loader2, Upload, X, ChevronLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const defaultAmenities = ["Wifi", "Kitchen", "Parking", "AC", "Washer", "Dryer", "TV", "Heating"];

// Loader Component (defined inline or imported)
const Loader = () => (
    <div className="flex justify-center items-center h-screen pt-20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
);


const EditPropertyPage = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: '', location: '', rent: '',
    bedrooms: 1, bathrooms: 1, amenities: [], photos: [], availableFrom: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  // Fetch Existing Property Data
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(`/properties/${id}`);
        const propertyData = response.data;

        if (!user || propertyData.lister._id !== user._id) {
           console.warn("Unauthorized attempt to edit listing.");
           navigate('/my-listings');
           return;
        }

        setFormData({
          title: propertyData.title || '',
          description: propertyData.description || '',
          propertyType: propertyData.propertyType || '',
          location: propertyData.location || '',
          rent: propertyData.rent?.toString() || '',
          bedrooms: propertyData.bedrooms || 1,
          bathrooms: propertyData.bathrooms || 1,
          amenities: propertyData.amenities || [],
          photos: propertyData.photos || [],
          availableFrom: propertyData.availableFrom ? new Date(propertyData.availableFrom).toISOString().split('T')[0] : '',
        });
      } catch (error) {
        console.error('Error fetching property data:', error);
        alert('Failed to load listing data. Please try again.');
        navigate('/my-listings');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && user) {
        fetchPropertyData();
    } else if (!user && !isLoading) {
        console.log("EditPropertyPage: No user found after load, redirecting.");
        navigate('/');
    }
     else if (!id) {
         setIsLoading(false);
     }

  }, [id, user, navigate]); // Removed isLoading dependency


  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    // --- ADDED LOGGING ---
    console.log(`handleChange called: name=${name}, value=${value}`);
    // --- END LOGGING ---
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleLocationChange = (value) => {
    setFormData(prev => ({ ...prev, location: value }));
  };
  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };
  const handlePhotoUpload = async (event) => {
     const files = Array.from(event.target.files);
     if (files.length === 0) return;
     setIsUploading(true);
     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
     const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
     const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
     const uploadedUrls = [];
     try {
       for (const file of files) {
         const formData = new FormData();
         formData.append("file", file);
         formData.append("upload_preset", uploadPreset);
         const response = await fetch(url, { method: "POST", body: formData });
         const result = await response.json();
         if (result.secure_url) {
           uploadedUrls.push(result.secure_url);
         } else { throw new Error('Upload failed'); }
       }
       setFormData(prev => ({ ...prev, photos: [...prev.photos, ...uploadedUrls] }));
     } catch (error) {
       console.error("Error uploading images:", error);
       alert("Image upload failed.");
     } finally {
       setIsUploading(false);
       if (fileInputRef.current) fileInputRef.current.value = "";
     }
  };
  const removePhoto = (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(url => url !== urlToRemove)
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.title || !formData.description || !formData.propertyType || !formData.location || !formData.rent) {
         throw new Error("Please fill in all required fields.");
      }
      const payload = {
          ...formData,
          rent: Number(formData.rent),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
      };
      const response = await axios.put(`/properties/${id}`, payload);
      alert('Listing updated successfully!');
      navigate(`/properties/${response.data._id}`);
    } catch (error) {
      console.error('Error updating property:', error);
      alert(error.message || 'Failed to update listing.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen">
        <div className="pt-24 flex-grow bg-background">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                 <Link to="/my-listings" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                   <ChevronLeft className="h-4 w-4 mr-1" /> Back to My Listings
                 </Link>
                <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>
                {/* Ensure formData is populated before rendering form */}
                {formData.title !== undefined ? ( // Check if title exists (even if empty string)
                  <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border shadow-sm">
                      {/* Title */}
                      <div>
                          <Label htmlFor="title" className="mb-1 block text-sm font-medium">Title *</Label>
                          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                      </div>
                      {/* Description */}
                      <div>
                          <Label htmlFor="description" className="mb-1 block text-sm font-medium">Description *</Label>
                          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={5}/>
                      </div>
                      {/* Type & Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <Label className="mb-1 block text-sm font-medium">Property Type *</Label>
                              <Select name="propertyType" value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)} required>
                                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="Apartment">Apartment</SelectItem>
                                      <SelectItem value="House">House</SelectItem>
                                      <SelectItem value="Room">Room</SelectItem>
                                      <SelectItem value="Studio">Studio</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div>
                              <Label className="mb-1 block text-sm font-medium">Location *</Label>
                              <LocationCombobox value={formData.location} onChange={handleLocationChange} />
                          </div>
                      </div>
                      {/* Rent, Beds, Baths */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                              <Label htmlFor="rent" className="mb-1 block text-sm font-medium">Monthly Rent (₹) *</Label>
                              <Input id="rent" name="rent" type="number" value={formData.rent} onChange={handleChange} required min="0"/>
                          </div>
                          <div>
                              <Label htmlFor="bedrooms" className="mb-1 block text-sm font-medium">Bedrooms</Label>
                              <Input id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} min="1"/>
                          </div>
                          <div>
                              <Label htmlFor="bathrooms" className="mb-1 block text-sm font-medium">Bathrooms</Label>
                              <Input id="bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} min="1"/>
                          </div>
                      </div>
                      {/* Available From */}
                      <div>
                          <Label htmlFor="availableFrom" className="mb-1 block text-sm font-medium">Available From</Label>
                          <Input id="availableFrom" name="availableFrom" type="date" value={formData.availableFrom} onChange={handleChange}/>
                      </div>
                      {/* Amenities */}
                      <div>
                          <Label className="mb-2 block text-sm font-medium">Amenities</Label>
                          <div className="flex flex-wrap gap-2">
                              {defaultAmenities.map(amenity => (
                                  <Button
                                      key={amenity} type="button"
                                      variant={formData.amenities.includes(amenity) ? 'default' : 'outline'}
                                      size="sm" onClick={() => handleAmenityToggle(amenity)}
                                      className={`rounded-full ${formData.amenities.includes(amenity) ? 'bg-primary text-primary-foreground' : ''}`}
                                  > {amenity} </Button>
                              ))}
                          </div>
                      </div>
                      {/* Photo Upload */}
                      <div>
                          <Label className="mb-2 block text-sm font-medium">Photos (up to 5)</Label>
                          <div className="flex flex-wrap gap-4 mb-4">
                              {formData.photos.map(url => (
                                  <div key={url} className="relative">
                                      <img src={url} alt="Uploaded" className="w-24 h-24 object-cover rounded-lg border"/>
                                      <Button type="button" variant="destructive" size="icon"
                                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                          onClick={() => removePhoto(url)}> <X className="h-4 w-4"/> </Button>
                                  </div>
                              ))}
                          </div>
                          <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()}
                              disabled={isUploading || formData.photos.length >= 5} className="w-full md:w-auto">
                              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                              {isUploading ? 'Uploading...' : 'Upload Photos'}
                          </Button>
                          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden"
                              accept="image/png, image/jpeg, image/jpg" multiple disabled={formData.photos.length >= 5}/>
                           <p className="text-xs text-muted-foreground mt-1">You can upload up to {5 - formData.photos.length} more photos.</p>
                      </div>
                      {/* Submit Button */}
                      <div className="pt-4 border-t border-border">
                          <Button type="submit" disabled={isSubmitting || isUploading} className="w-full md:w-auto bg-[#5b5dda] hover:bg-[#4a4ab5]">
                              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              {isSubmitting ? 'Updating Listing...' : 'Update Listing'}
                          </Button>
                      </div>
                  </form>
                ) : (
                  // Show message if form data still loading after main loading state is false
                  !isLoading && <p className="text-center text-muted-foreground">Loading form data...</p>
                )}
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default EditPropertyPage;