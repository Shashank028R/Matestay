import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js"; // <-- IMPORT CONVERSATION

// Add a new message
export const addMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  const senderId = req.user.id;

  const newMessage = new Message({
    conversationId,
    senderId,
    text,
  });

  try {
    const savedMessage = await newMessage.save();

    // --- THIS IS THE NEW LOGIC ---
    // Update the parent conversation's 'updatedAt' timestamp
    // This marks it as the most recent conversation.
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: Date.now(),
    });
    // --- END OF NEW LOGIC ---

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};