import * as dotenv from 'dotenv';
dotenv.config({
  debug: true,
  path: './.env'
});

import express from 'express';
import cors from 'cors';
import { 
  getLastCurrencies,
  initBase,
  updateFavorites,
  getUserSettings,
  getAppSettings, 
  updateSettings,
  saveMessage,
  getSubscriptionSettings,
  saveSubscription,
  getSubscriptions,
  deleteSubscriptions,
  updateSubscription,
  getStatistic,
  addKofiResponse
} from './server/base.js';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const allowedDomain = 'https://localhost:3301';
const corsOptions = {
  origin: allowedDomain,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('./dist'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  initBase();
});

app.get('/api/config/:userId', async (req, res) => {
  try {
    const userSettings = await getUserSettings(req.params.userId, true);
    const appSettings = await getAppSettings();
    const config = {
      userId: req.params.userId,
      ...userSettings,
      ...appSettings
    }

    res.json(config);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/last/:country/:userId', async (req, res) => {
  try {
    const { data, settings } = await getLastCurrencies(req.params.country, req.params.userId);
    res.json({ data, settings });
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/settings/:userId', async (req, res) => {
  try {
    const data = await getUserSettings(req.params.userId);
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/favorites/:country/:userId', async (req, res) => {
  try {
    await updateFavorites(req.body.favorites, req.params.country, req.params.userId);
    res.send('OK');
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/settings/:userId', async (req, res) => {
  try {
    await updateSettings(req.body.settings, req.params.userId);
    res.send('OK');
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/message/:userId', async (req, res) => {
  try {
    const response = await saveMessage(req.body.message, req.params.userId);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/subscription/settings', async (req, res) => {
  try {
    const data = await getSubscriptionSettings();
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/subscription/:userId', async (req, res) => {
  try {
    const  response = await saveSubscription(req.body.subscription);
    
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.put('/api/subscription/:userId/:subscriptionId', async (req, res) => {
  try {
    const response = await updateSubscription(req.body.subscription, req.params.subscriptionId, req.params.userId);

    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/subscription/:userId', async (req, res) => {
  try {
    const data = await getSubscriptions(req.params.userId);
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

app.delete('/api/subscription/:userId/:subscriptionId', async (req, res) => {
  try {
    const data = await deleteSubscriptions(req.params.userId, req.params.subscriptionId);
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/statistic', async (req, res) => {
  try {
    const data = await getStatistic();
    
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/integrations/kofi', async (req, res) => {
  try {
    addKofiResponse(JSON.parse(req.body.data));
    res.send('OK');
  } catch (err) {
    console.log(err);
  }
});