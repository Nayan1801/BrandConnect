import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const handleMessageWebhook = async (req, res) => {
  const data = req.body;

  if (data.object === "page") {
    for (let entry of data.entry) {
      for (let messaging of entry.messaging) {
        const senderId = messaging.sender.id;
        const pageId = entry.id;
        const messageText = messaging.message?.text;

        if (!messageText) continue;

        let conversation = await Conversation.findOne({ senderId, pageId });
        const now = new Date();

        if (!conversation || (now - new Date(conversation.lastMessageAt)) > 86400000) {
          conversation = await Conversation.create({ senderId, pageId, lastMessageAt: now });
        }

        await Message.create({
          conversationId: conversation._id,
          sender: "customer",
          content: messageText,
          timestamp: now,
        });

        conversation.lastMessageAt = now;
        await conversation.save();
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
