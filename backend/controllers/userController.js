import User from "../models/User.js";

// --- updateProfile FUNCTION (No changes) ---
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name, phone, gender, age, location,
      budget, occupation, lifestyle, bio, profilePic,
    } = req.body;

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.age = age || user.age;
    user.location = location || user.location;
    user.budget = budget || user.budget;
    user.occupation = occupation || user.occupation;
    user.lifestyle = lifestyle || user.lifestyle;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;
    user.profileSetupComplete = true;

    const updatedUser = await user.save();
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- getUserProfile FUNCTION (No changes) ---
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- searchUsers FUNCTION (No changes) ---
export const searchUsers = async (req, res) => {
  try {
    const { location, maxBudget, gender, limit } = req.query; 

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const query = {
      location: location, 
      profileSetupComplete: true,
      _id: { $ne: req.user.id } 
    };

    if (maxBudget) {
      query.budget = { $lte: Number(maxBudget) };
    }
    if (gender && gender !== 'Any') {
      query.gender = gender;
    }
    
    let userQuery = User.find(query);
    if (limit) {
      userQuery = userQuery.limit(Number(limit));
    }
    
    const users = await userQuery.select("-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- NEW getFeaturedUsers FUNCTION ---
export const getFeaturedUsers = async (req, res) => {
  try {
    // Use MongoDB aggregation to get 6 random users
    const users = await User.aggregate([
      { $match: { profileSetupComplete: true } }, // Only get users with complete profiles
      { $sample: { size: 6 } }, // Get 6 random documents
      { $project: { password: 0 } } // Remove the password
    ]);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};