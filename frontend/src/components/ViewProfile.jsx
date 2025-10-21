import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, DollarSign, User, Calendar, Phone, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

export default function ViewProfile({ user, onEdit }) {
  const {
    name,
    occupation,
    location,
    bio,
    age,
    gender,
    budget,
    phone,
    lifestyle = [],
    profilePic
  } = user || {};

  return (
    <div className="bg-card p-6 md:p-10 rounded-lg border border-border shadow-lg max-w-3xl mx-auto">

      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <img
          src={profilePic || defaultAvatar}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 ring-4 ring-primary/10"
        />
        <div className="text-center sm:text-left flex-grow">
          <h1 className="text-3xl font-bold">{name || 'Your Name'}</h1>
          <p className="text-lg text-muted-foreground">{occupation || 'No occupation set'}</p>
          {location && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-4 h-4" /> {location}
            </p>
          )}
        </div>
        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
           {/* --- THIS IS THE FIX --- */}
           <Button asChild variant="outline" className="w-full sm:w-auto">
             <Link to="/my-listings">
               {/* Wrap icon and text in a span */}
               <span className="flex items-center">
                 <List className="w-4 h-4 mr-2" /> My Listings
               </span>
             </Link>
           </Button>
           {/* --- END FIX --- */}
           <Button onClick={onEdit} className="w-full sm:w-auto bg-[#5b5dda] hover:bg-[#4a4ab5]">
             Edit Profile
           </Button>
        </div>
      </div>

      {/* --- Details Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-background p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">About Me</h3>
          <p className="text-muted-foreground text-sm">{bio || 'You haven\'t written a bio yet.'}</p>
        </div>
        <div className="bg-background p-4 rounded-lg border space-y-3">
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <p className="flex items-center text-sm gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <strong>Phone:</strong> {phone || 'Not set'}
          </p>
          <p className="flex items-center text-sm gap-2">
            <User className="w-4 h-4 text-primary" />
            <strong>Gender:</strong> {gender || 'Not set'}
          </p>
          <p className="flex items-center text-sm gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <strong>Age:</strong> {age || 'Not set'}
          </p>
          <p className="flex items-center text-sm gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <strong>Budget:</strong> {budget ? `₹${budget}` : 'Not set'}
          </p>
        </div>
      </div>

      {/* --- Lifestyle Section --- */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Lifestyle</h3>
        {lifestyle.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {lifestyle.map(tag => (
              <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No lifestyle tags selected.</p>
        )}
      </div>

    </div>
  );
}