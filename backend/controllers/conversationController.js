import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js"; // <-- IMPORT MESSAGE

// Create a new conversation (No changes)
export const newConversation = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    let existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- THIS FUNCTION IS UPDATED ---
export const getConversations = async (req, res) => {
  try {
    // 1. Find conversations, sorted by most recent activity
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] },
    })
    .populate("members", "name profilePic")
    .sort({ updatedAt: -1 }); // <-- Sort by the timestamp we added

    // 2. Attach the last message to each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (convo) => {
        const lastMessage = await Message.findOne({
          conversationId: convo._id,
        }).sort({ createdAt: -1 }); // Find the most recent message

        const convoObject = convo.toObject(); // Convert to plain object
        convoObject.lastMessage = lastMessage; // Attach the message (or null)
        return convoObject;
      })
    );

    res.status(200).json(conversationsWithLastMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};