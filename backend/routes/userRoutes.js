import express from "express";
import { 
  updateProfile, 
  getUserProfile, 
  searchUsers,
  getFeaturedUsers // <-- IMPORT THE NEW FUNCTION
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- NEW FEATURED ROUTE (public) ---
router.get("/featured", getFeaturedUsers);

// --- PROTECTED ROUTES ---
router.put("/update", protect, updateProfile);
router.get("/profile", protect, getUserProfile);
router.get("/search", protect, searchUsers);

export default router;