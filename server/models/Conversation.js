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
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
