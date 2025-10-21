import Property from "../models/Property.js";
import User from "../models/User.js";

// --- Create ---
export const createProperty = async (req, res) => {
  console.log("Backend: Received request to create property."); // Log 1
  console.log("Backend: User ID:", req.user?.id); // Log 2
  console.log("Backend: Request body:", req.body); // Log 3
  try {
    console.log("Backend: Inside try block..."); // Log 4
    const newProperty = new Property({
      ...req.body,
      lister: req.user.id,
    });
    console.log("Backend: New Property object created:", newProperty); // Log 5
    const savedProperty = await newProperty.save();
    console.log("Backend: Property saved successfully:", savedProperty); // Log 6
    res.status(201).json(savedProperty);
    console.log("Backend: Response sent."); // Log 7
  } catch (error) {
    console.error("Backend: Error creating property:", error); // Log 8
    res.status(500).json({ message: "Error creating property", error: error.message });
  }
};

// --- Get By ID ---
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "lister",
      "name profilePic email phone"
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
     console.error("Backend: Error fetching property by ID:", error); // Added error log
    res.status(500).json({ message: "Error fetching property", error: error.message });
  }
};

// --- Search (with Regex Location & Logging) ---
export const searchProperties = async (req, res) => {
  try {
    const { location, propertyType, minRent, maxRent, bedrooms, amenities, limit, excludeId } = req.query;
    const query = { isAvailable: true };

    // Using Regex for Location (case-insensitive partial match)
    if (location) {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (propertyType) query.propertyType = propertyType;
    // Use $gte (greater than or equal to) for bedrooms
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }
    if (amenities) {
      // Trim whitespace from each amenity and filter out empty strings
      const amenitiesArray = amenities.split(',').map(a => a.trim()).filter(a => a);
      if (amenitiesArray.length > 0) {
          // Use $all to ensure the property has ALL specified amenities
          query.amenities = { $all: amenitiesArray };
      }
    }
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    let propertyQuery = Property.find(query)
      .populate("lister", "name profilePic")
      .sort({ createdAt: -1 });

    if (limit) {
      propertyQuery = propertyQuery.limit(Number(limit));
    }

    const properties = await propertyQuery;
    // Added Log
    console.log(`Backend: Found ${properties.length} properties matching query:`, JSON.stringify(query));
    res.status(200).json(properties);
  } catch (error) {
    console.error("Backend: Error searching properties:", error); // Added error logging
    res.status(500).json({ message: "Error searching properties", error: error.message });
  }
};

// --- Get User Properties ---
export const getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ lister: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Backend: Error fetching user properties:", error); // Added error log
    res.status(500).json({ message: "Error fetching user properties", error: error.message });
  }
};

// --- Update ---
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (property.lister.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Backend: Error updating property:", error); // Added error log
    res.status(500).json({ message: "Error updating property", error: error.message });
  }
};

// --- Delete ---
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (property.lister.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Backend: Error deleting property:", error); // Added error log
    res.status(500).json({ message: "Error deleting property", error: error.message });
  }
};