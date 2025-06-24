import express from 'express';
import Conversation from '../models/Conversation.js';
import FBPage from '../models/FBPage.js';

const router = express.Router();

// ✅ Webhook Verification
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'richpanel_dev_verify';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WEBHOOK_VERIFIED');
    res.set('Content-Type', 'text/plain');
    return res.status(200).send(challenge);
  } else {
    console.warn('❌ WEBHOOK VERIFICATION FAILED');
    return res.sendStatus(403);
  }
});

// ✅ Message Receiver
router.post('/', async (req, res) => {
  console.log("📩 Received webhook POST:", JSON.stringify(req.body, null, 2)); 
  const body = req.body;

  if (body.object !== 'page') return res.sendStatus(404);

  try {
    for (const entry of body.entry) {
      const pageID = entry.id;
      const timeOfEvent = entry.time;

      // ✅ Facebook sends events inside messaging array
      if (!entry.messaging) continue;

      for (const event of entry.messaging) {
        const senderId = event.sender?.id;
        const messageText = event.message?.text;

        if (!senderId || !messageText) continue;

        const fbPage = await FBPage.findOne({ pageId: pageID });
        if (!fbPage) {
          console.warn(`⚠️ No FBPage found for pageId ${pageID}`);
          continue;
        }

        // ✅ Check for existing conversation
       // ✅ Check for existing conversation (24-hour window)
        let conversation = await Conversation.findOne({ senderId, pageId: pageID }).sort({ updatedAt: -1 });

        if (conversation && new Date() - new Date(conversation.lastMessageAt) < 24 * 60 * 60 * 1000) {
          // Continue the same conversation
          conversation.messages.push({
            text: messageText,
            fromAgent: false,
            createdAt: new Date(),
          });
          conversation.lastMessageAt = new Date();
          await conversation.save();
        } else {
          // Create new conversation
          await Conversation.create({
            user: fbPage.user,
            senderId,
            senderName: 'FB User', // optionally fetch real name via Graph API
            pageId: pageID,
            lastMessageAt: new Date(),
            messages: [
              { text: messageText, fromAgent: false, createdAt: new Date() }
            ]
          });
        }


        console.log(`✅ Message saved from ${senderId}: "${messageText}"`);
      }
    }

    // ✅ Required by FB
    res.status(200).send('EVENT_RECEIVED');
  } catch (err) {
    console.error('❌ Error handling webhook:', err);
    res.sendStatus(500);
  }
});

export default router;
