import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    // members will contain the user IDs of the two people in the chat
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);