import express from "express";
import { connectPage, disconnectPage, fbCallback } from "../controllers/fbController.js";
import { verifyToken } from '../middleware/auth.js';
import FBPage from "../models/FBPage.js";
const router = express.Router();

router.get('/connect', connectPage);
router.get('/callback', fbCallback);
router.delete('/disconnect', verifyToken, disconnectPage);

// routes/fb.js
router.get('/status', verifyToken, async (req, res) => {
  const page = await FBPage.findOne({ user: req.user.id });
  if (!page) return res.json({ connected: false });

  res.json({
    connected: true,
    pageName: page.name,
  });
});

export default router;
