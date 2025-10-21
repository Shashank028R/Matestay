import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bath, BedDouble, CalendarDays, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const placeholderImage = "https://via.placeholder.com/400x300.png?text=No+Image";

const PropertyCard = ({ property }) => {
  const {
    _id,
    title,
    location,
    rent,
    bedrooms,
    bathrooms,
    photos,
    propertyType,
    availableFrom
  } = property;

  const displayImage = photos && photos.length > 0 ? photos[0] : placeholderImage;

  return (
    <Card className="group overflow-hidden rounded-xl border border-border hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative aspect-video">
        <img
          src={displayImage}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <Badge variant="secondary" className="absolute top-3 left-3">{propertyType}</Badge>
      </div>

      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" /> {location}
        </p>
        <div className="flex justify-between items-center mb-3">
           <p className="flex items-center gap-1 text-sm text-foreground">
             <IndianRupee className="h-4 w-4 text-primary" />
             <span className="font-semibold">{rent.toLocaleString()}</span> / month
           </p>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><BedDouble className="h-4 w-4"/> {bedrooms}</span>
            <span className="flex items-center gap-1"><Bath className="h-4 w-4"/> {bathrooms}</span>
          </div>
        </div>
         <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" /> Available from: {new Date(availableFrom).toLocaleDateString()}
         </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-[#5b5dda] text-white hover:bg-[#4a4ab5]">
          <Link to={`/properties/${_id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;