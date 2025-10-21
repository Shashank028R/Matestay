import express from "express";
import {
  createProperty,
  getPropertyById,
  searchProperties,
  getUserProperties, // Make sure this is imported
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Define specific routes BEFORE dynamic ':id' routes ---
router.get("/search", searchProperties); // Search listings (public)
router.get("/my-listings", protect, getUserProperties); // Get user's listings (protected)
router.post("/", protect, createProperty); // Create a new listing (protected)

// --- Define dynamic ':id' routes AFTER specific ones ---
router.get("/:id", getPropertyById); // Get a single listing by its ID (public)
router.put("/:id", protect, updateProperty); // Update a specific listing (protected)
router.delete("/:id", protect, deleteProperty); // Delete a specific listing (protected)

export default router;