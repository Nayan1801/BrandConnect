import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import FBPage from '../models/FBPage.js';
import Conversation from '../models/Conversation.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id }).sort({ lastMessageAt: -1 });

    const data = conversations.map((c) => ({
      _id: c._id,
      senderId: c.senderId,
      senderName: c.senderName,
      pageId: c.pageId,
      lastMessage: c.messages.length ? c.messages[c.messages.length - 1].text : '',
      lastMessageAt: c.lastMessageAt,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load conversations' });
  }
});


router.get('/:id', verifyToken, async (req, res) => {
  const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user.id });
  if (!conversation) return res.status(404).json({ message: 'Not found' });

  res.json(conversation.messages);
});

router.post('/:id/reply', verifyToken, async (req, res) => {
  const { message } = req.body;
  const conversationId = req.params.id;

  try {
    const conversation = await Conversation.findOne({ _id: conversationId, user: req.user.id });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const fbPage = await FBPage.findOne({ pageId: conversation.pageId });
    if (!fbPage) return res.status(403).json({ message: 'FB Page not connected' });

    // Send message using Facebook Graph API
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/me/messages`,
      {
        messaging_type: "RESPONSE",
        recipient: { id: conversation.senderId },
        message: { text: message },
      },
      {
        headers: { Authorization: `Bearer ${fbPage.accessToken}` },
      }
    );

    // Save to DB
    conversation.messages.push({
      text: message,
      fromAgent: true,
      createdAt: new Date(),
    });
    await conversation.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Reply error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to send message' });
  }
});



export default router;
