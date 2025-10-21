import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import ListingsSection from '../components/ListingsSection';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar'; // <-- IMPORT FILTERBAR
import { Loader2 } from 'lucide-react';

const SearchResults = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  
  // State to hold our filter values
  const [filters, setFilters] = useState({
    maxBudget: 50000,
    gender: 'Any',
  });

  // This function will be passed down to the FilterBar
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (location) {
      const fetchListings = async () => {
        setIsLoading(true);
        try {
          // --- Build the query string with all filters ---
          const params = new URLSearchParams({
            location: location,
            maxBudget: filters.maxBudget,
            gender: filters.gender,
          });
          
          const response = await axios.get(`/user/search?${params.toString()}`);
          setListings(response.data);
        } catch (err) {
          console.error("Search failed:", err);
          alert(err.response?.data?.message || "Search failed.");
          setListings([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchListings();
    }
    // Re-run this effect if the location OR filters change
  }, [location, filters]); 

  const title = `Search Results for "${location}"`;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow pt-28"> {/* pt-28 for your fixed navbar */}
        
        {/* --- ADD THE FILTER BAR HERE --- */}
        <FilterBar onApplyFilters={handleApplyFilters} />

        {/* Show loader while fetching */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <ListingsSection 
            listings={listings} 
            title={title} 
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;