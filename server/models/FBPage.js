import mongoose from "mongoose";

const fbPageSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    // unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User model
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("FBPage", fbPageSchema);

