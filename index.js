import * as dotenv from 'dotenv';
dotenv.config({
  path: './.env'
});

const env = process.env.environment || 'prod';
const mediaFolderPath = process.env['mediaFolderPath_' + env];

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

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
  getAllSubscriptions,
  deleteSubscriptions,
  updateSubscription,
  getStatistic,
  addKofiResponse,
  addToContentManager
} from './server/base.js';

const app = express();
const port = 3000;
// const allowedOrigins = ['https://localhost:3301', 'http://localhost:5173'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log('origin', origin)
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   optionsSuccessStatus: 200
// }

// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('./dist'));
app.use('/manager', express.static('./content-manager/dist'));
app.use('/files', express.static(mediaFolderPath));

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

app.get('/api/subscriptions-all/:mode', async (req, res) => {
  try {
    const data = await getAllSubscriptions(req.params.mode);
    res.json({ data: data, status: true });
  } catch (err) {
    res.json({ status: false });
    console.log(err);
  }
});

app.post('/api/subscription-generate-image/:mode', async (req, res) => {
  try {
    const mode = req.params.mode;
    const addedToManagerRequests = await addToContentManager(mode, req.body);

    if (!addedToManagerRequests) {
      res.json({ status: false });
      return;
    } 

    const fileName = '/images/' + req.body.MANAGER_FILE_NAME + '.png';
    const filePath = mediaFolderPath + fileName;
    console.log('filePath', filePath)
    
    let count = 0;
    const countLimit = 60;
    const interval = setInterval(() => {
      try {
        fs.statSync(filePath);
        console.log('File exists');
        clearInterval(interval);
        res.json({ fileName, status: true });
      } catch {
        console.log('File does not exist');
        count += 1;
        if (count >= countLimit) {
          clearInterval(interval);
          res.json({ status: false });
        }
      }
    }, 1000);
  } catch (err) {
    res.json({ status: false });
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