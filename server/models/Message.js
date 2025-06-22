import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  sender: String, // "customer" or "agent"
  content: String,
  timestamp: Date,
});

export default mongoose.model("Message", messageSchema);
