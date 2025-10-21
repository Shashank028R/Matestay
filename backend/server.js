import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // <-- IMPORT NEW ROUTES

// --- Config ---
dotenv.config();
connectDB();
const app = express();

// --- Create HTTP Server and Socket.IO Server ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use env variable
  },
});

// --- Middleware ---
// Use body-parser middleware provided by Express for webhook raw body if needed later
// For Stripe webhook: app.post("/api/payments/webhook", express.raw({type: 'application/json'}), handleWebhook);
// For now, standard JSON parsing is fine for placeholders.
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173" // Allow requests from frontend
}));
app.use(express.json()); // For parsing application/json

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payments", paymentRoutes); // <-- REGISTER PAYMENT ROUTES

// --- Socket.IO Connection Logic ---
let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("Socket: A user connected.", socket.id);

  socket.on("addUser", (userId) => {
    if(userId) { // Check if userId is provided
      addUser(userId, socket.id);
      io.emit("getUsers", onlineUsers);
      console.log(`Socket: User ${userId} added. Online users:`, onlineUsers.length);
    }
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    const user = getUser(receiverId);
    if (user) {
        console.log(`Socket: Sending message from ${senderId} to ${receiverId}`);
      io.to(user.socketId).emit("getMessage", { senderId, text, conversationId });
      io.to(user.socketId).emit("getNotification", { senderId, text });
    } else {
        console.log(`Socket: Receiver ${receiverId} not online.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket: A user disconnected.", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
    console.log("Socket: User removed. Online users:", onlineUsers.length);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));