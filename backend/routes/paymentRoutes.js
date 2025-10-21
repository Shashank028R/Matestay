import express from "express";
import {
  createCheckoutSession,
  handleWebhook, // Placeholder for payment gateway notifications
} from "../controllers/paymentController.js"; // We'll create this next
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Create Checkout Session (User initiates payment)
// User must be logged in to create a session
router.post("/create-checkout-session", protect, createCheckoutSession);

// 2. Webhook Handler (Payment gateway sends confirmation)
// This route should NOT be protected by 'protect' middleware
// It needs to be publicly accessible for the payment gateway to call it.
// We'll add specific verification inside the handler later.
router.post("/webhook", handleWebhook);

export default router;