import axios from 'axios';
import FBPage from '../models/FBPage.js';
import jwt from 'jsonwebtoken';


export const connectPage = async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized - Token Missing' });

  try {
    //console.log(token);
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Store token in cookie (httpOnly optional in dev)
    res.cookie('token', token, { httpOnly: false });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const redirectWithToken = process.env.FACEBOOK_REDIRECT_URI;
    req.user = decoded;
    //res.cookie('token', token, { httpOnly: true }); // temporary storage
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${redirectWithToken}&scope=pages_manage_metadata,pages_read_engagement`;
    res.redirect(url);
  } catch (err) {
    console.error('Connect error:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const fbCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.status(400).send("Authorization was cancelled or failed.");
  }
  const token = req.cookies.token;
  
  // const userId = decoded.id;
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded
  const tokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
    params: {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      code,
    },
  });
  const { access_token } = tokenRes.data;

  if (!access_token) {
      return res.status(400).json({ error: 'Access token not received' });
  }
  const pageRes = await axios.get(`https://graph.facebook.com/me/accounts`, {
    params: { access_token }
  });
  const page = pageRes.data?.data?.[0];

  if (!page || !page.id || !page.access_token) return res.status(400).send('No managed pages found or missing permissions');
   
  // Save to MongoDB
    await FBPage.findOneAndUpdate(
      { pageId: page.id },
      {
        accessToken: page.access_token,
        name: page.name,
        user: req.user.id,
      },
      {
        upsert: true, // create if not exists
        new: true,
        runValidators: true,
      }
    );


    // await FBPage.findOneAndUpdate(
    //   { user: req.user.id },
    //   {
    //     pageId: page.id,
    //     accessToken: page.access_token,
    //     name: page.name,
    //     user: req.user.id,
    //   },
    //   { upsert: true, new: true }
    // );
  // await FBPage.create({
  //   pageId: page.id,
  //   accessToken: page.access_token,
  //   name: page.name,
  //   user: req.user?.id, // from state
  // });
  // const pageData = await FBPage.create({
  //   pageId: page.id,
  //   accessToken: page.access_token,
  //   name: page.name,
  //   user: req.user?.id, // Use JWT middleware to get user
  // });
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(`${frontendURL}/dashboard`);

  } catch (error) {
    console.error('Facebook callback error:', error.response?.data || error.message);
    res.status(500).send("Failed to connect your Facebook page.");
  }
  
};

export const disconnectPage = async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await FBPage.findOneAndDelete({ user: userId });

    if (deleted) {
      return res.status(200).json({ message: 'Disconnected successfully' });
    } else {
      return res.status(404).json({ message: 'No connected page found for this user' });
    }
  } catch (err) {
    console.error('Disconnect error:', err);
    return res.status(500).json({ message: 'Server error during disconnect' });
  }
};
