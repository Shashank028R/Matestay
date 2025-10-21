import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import heroImage from "../assets/hero-image.jpg"; 
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import { useAuth } from "../context/AuthContext"; // <-- Import useAuth

const Hero = () => { 
  const [location, setLocation] = useState("");
  const navigate = useNavigate(); // <-- Initialize the hook
  const { user } = useAuth(); // <-- Get user for the login check

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (!user) {
      alert("Please log in to search for roommates.");
      // You could also open your login modal here
      return;
    }
    
    if (location) {
      // Redirect to the new search page with the location as a query parameter
      navigate(`/search?location=${encodeURIComponent(location)}`);
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern shared living space"
          className="w-full h-full object-cover opacity-10 dark:opacity-10"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Find Your Perfect Roommate
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Connect with compatible roommates and discover your ideal living
            space. Safe, verified, and hassle-free.
          </p>

          <form 
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-6 max-w-2xl mx-auto border border-border shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <LocationCombobox
                  value={location}
                  onChange={setLocation}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-[#5b5dda] text-white hover:bg-[#4a4ab5]"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>🏠 10,000+ Listings</span>
            <span>✓ Verified Profiles</span>
            <span>💬 Instant Messaging</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;