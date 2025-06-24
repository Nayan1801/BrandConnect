import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: String,
  fromAgent: Boolean,
  createdAt: Date,
});

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderId: String,         // FB User ID
    senderName: String,
    pageId: String,           // FB Page ID
    lastMessageAt: Date, // used for 24h logic
    messages: [{ text: String, fromAgent: Boolean, createdAt: Date }],

  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
