import express from "express";
import { addMessage, getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a new message (we'll also do this with sockets)
router.post("/", protect, addMessage);

// Get all messages for one conversation
router.get("/:conversationId", protect, getMessages);

export default router;