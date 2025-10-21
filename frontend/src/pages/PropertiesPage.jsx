import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locations } from "@/lib/indianLocations"; // Import the locations list

const availableAmenities = ["Wifi", "Kitchen", "Parking", "AC", "Washer", "Dryer", "TV", "Heating"];

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [location, setLocation] = useState(''); // Default value is ''
  const [propertyType, setPropertyType] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // fetchProperties function remains the same
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location); // Only add if not ''
      if (propertyType) params.append('propertyType', propertyType);
      if (minRent) params.append('minRent', minRent);
      if (maxRent) params.append('maxRent', maxRent);
      if (bedrooms > 1) params.append('bedrooms', bedrooms);
      if (selectedAmenities.length > 0) {
        params.append('amenities', selectedAmenities.join(','));
      }

      const searchUrl = `/properties/search?${params.toString()}`;
      console.log("Frontend: Fetching properties from URL:", searchUrl);
      const response = await axios.get(searchUrl);
      console.log("Frontend: Received properties:", response.data);
      setProperties(response.data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // handleSearch remains the same
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  // handleAmenityChange remains the same
  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex-grow bg-background">

        {/* --- Filter Bar --- */}
        <section className="py-8 bg-card border-b border-border sticky top-[calc(4rem+1rem)] z-40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">

              {/* --- Location Select (FIXED) --- */}
              <div className="md:col-span-2">
                <Label className="mb-1 block text-xs font-medium text-muted-foreground">Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full">
                    {/* Placeholder handles the "Any Location" text when value is '' */}
                    <SelectValue placeholder="Any Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* --- REMOVED THIS ITEM --- */}
                    {/* <SelectItem value="">Any Location</SelectItem> */}
                    {locations.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* --- END FIX --- */}

              {/* Property Type Select */}
              <div>
                 <Label className="mb-1 block text-xs font-medium text-muted-foreground">Type</Label>
                 <Select value={propertyType} onValueChange={setPropertyType}>
                   <SelectTrigger><SelectValue placeholder="Any Type" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Apartment">Apartment</SelectItem>
                     <SelectItem value="House">House</SelectItem>
                     <SelectItem value="Room">Room</SelectItem>
                     <SelectItem value="Studio">Studio</SelectItem>
                     <SelectItem value="Other">Other</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
              {/* Bedrooms Select */}
              <div>
                 <Label className="mb-1 block text-xs font-medium text-muted-foreground">Min. Beds</Label>
                 <Select value={bedrooms.toString()} onValueChange={(v) => setBedrooms(Number(v))}>
                   <SelectTrigger><SelectValue placeholder="Any Beds" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="1">1+ Beds</SelectItem>
                     <SelectItem value="2">2+ Beds</SelectItem>
                     <SelectItem value="3">3+ Beds</SelectItem>
                     <SelectItem value="4">4+ Beds</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
              {/* Rent Inputs */}
               <div>
                 <Label className="mb-1 block text-xs font-medium text-muted-foreground">Min Rent (₹)</Label>
                 <Input
                   type="number"
                   placeholder="Min"
                   value={minRent}
                   onChange={(e) => setMinRent(e.target.value)}
                   min="0"
                 />
              </div>
               <div>
                 <Label className="mb-1 block text-xs font-medium text-muted-foreground">Max Rent (₹)</Label>
                 <Input
                   type="number"
                   placeholder="Max"
                   value={maxRent}
                   onChange={(e) => setMaxRent(e.target.value)}
                   min="0"
                 />
              </div>
              {/* Amenities Dropdown */}
              <div>
                 <Label className="mb-1 block text-xs font-medium text-muted-foreground">Amenities</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <span>
                          {selectedAmenities.length === 0
                            ? "Select Amenities"
                            : selectedAmenities.length === 1
                            ? selectedAmenities[0]
                            : `${selectedAmenities.length} selected`}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>Select Amenities</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {availableAmenities.map(amenity => (
                         <DropdownMenuCheckboxItem
                            key={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityChange(amenity)}
                         >
                           {amenity}
                         </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>

              {/* Search Button */}
              <Button type="submit" className="w-full bg-[#5b5dda] text-white hover:bg-[#4a4ab5] md:col-start-7">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </form>
          </div>
        </section>

        {/* --- Results Section --- */}
        <section className="py-12">
           <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">No Properties Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Available Properties ({properties.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map((prop) => (
                    <PropertyCard key={prop._id} property={prop} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PropertiesPage;