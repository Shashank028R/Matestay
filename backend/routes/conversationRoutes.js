import express from "express";
import {
  newConversation,
  getConversations,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Start a new conversation
// We'll pass the other user's ID in the body
router.post("/", protect, newConversation);

// Get all conversations for the logged-in user
router.get("/", protect, getConversations);

export default router;