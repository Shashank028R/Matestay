import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    // Link to the user who posted the listing
    lister: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Room", "Studio", "Other"],
      required: true,
    },
    location: { // Can reuse the location string format
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    amenities: [String], // e.g., ["Wifi", "Kitchen", "Parking", "AC"]
    photos: [String], // Array of Cloudinary URLs
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", PropertySchema);