import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.js';
import fbRoutes from './routes/fb.js';
import messageRoutes from './routes/message.js';
import fbWebhookRoutes from './routes/fbwebhook.js';


app.use('/api/auth', authRoutes);
app.use('/api/fb', fbRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/webhook', fbWebhookRoutes);

app.get("/", (req, res) => res.send("API Working"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
