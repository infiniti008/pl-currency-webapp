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
import routeRender from './server/routeRender.js';
import routeFeed from './server/routeFeed.js';
import path from 'path';

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
  addToContentManager,
  getRenderSettings,
  setRenderSettings,
  updateSubscriptionFromManager,
  deleteSubscriptionFromManager,
  createSubscriptionFromManager,
  getKeys,
  getKeyData,
  setChartView,
  getChartView,
  removeChartView,
  updateKeyFromManager,
  createKeyFromManager
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

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*")
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('./dist'));
// app.use('/render', express.static('./dist'));
app.use('/manager', express.static('./content-manager/dist'));
app.use('/files', express.static(mediaFolderPath));

app.use('/api/render', routeRender);
app.use('/api/feed', routeFeed);

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

app.get('/api/last/:country', async (req, res) => {
  try {
    const { data, settings } = await getLastCurrencies(req.params.country);
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

app.post('/api/subscription/:mode', async (req, res) => {
  try {
    const  response = await saveSubscription(req.body.subscription, req.params.mode);
    
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.put('/api/subscription/:userId/:subscriptionId/:mode', async (req, res) => {
  try {
    const response = await updateSubscription(req.body.subscription, req.params.subscriptionId, req.params.userId, req.params.mode);

    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/subscription/:userId/:mode', async (req, res) => {
  try {
    const data = await getSubscriptions(req.params.userId, req.params.mode);
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

app.patch('/api/manage-subscription/:mode/:subscriptionId', async (req, res) => {
  try {
    const status = await updateSubscriptionFromManager(req.params.mode, req.params.subscriptionId, req.body);
    res.json({ status });
  } catch(err) {
    res.json({ status: false });
    console.log(err);
  }
});

app.post('/api/manage-subscription/:mode/', async (req, res) => {
  try {
    const status = await createSubscriptionFromManager(req.params.mode, req.body);
    res.json({ status });
  } catch(err) {
    res.json({ status: false });
    console.log(err);
  }
});

app.delete('/api/manage-subscription/:mode/:subscriptionId/:platform', async (req, res) => {
  try {
    const status = await deleteSubscriptionFromManager(req.params.mode, req.params.subscriptionId, req.params.platform);
    res.json({ status });
  } catch(err) {
    res.json({ status: false });
    console.log(err);
  }
});

app.delete('/api/subscription/:userId/:subscriptionId/:mode', async (req, res) => {
  try {
    const data = await deleteSubscriptions(req.params.userId, req.params.subscriptionId, req.params.mode);
    res.json({ data: data });
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

app.get('/api/statistic', async (req, res) => {
  try {
    const data = await getStatistic();
    
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json({ status: false });
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

app.get('/api/render-settings/:mode', async (req, res) => {
  try {
    const data = await getRenderSettings(req.params.mode);
    res.json({ data: data });
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

app.post('/api/render-settings/:mode', async (req, res) => {
  try {
    const status = await setRenderSettings(req.params.mode, req.body);
    res.json({ status });
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

app.get('/api/app/settings', async (req, res) => {
  try {
    const appSettings = await getAppSettings();
    const response = { appSettings }

    for(let i = 0; i < appSettings.countries.length; i++) {
      const country = appSettings.countries[i];
      response['keys_' + country] = await getKeys(country);
    }

    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/get-key-data', async (req, res) => {
  try {
    const data = await getKeyData(req.body);
    res.json({ data });
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

app.post('/api/manage-charts-view/:mode', async (req, res) => {
  try {
    const status = await setChartView(req.params.mode, req.body);
    res.json({ status });
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

app.get('/api/manage-charts-view/:mode/:name', async (req, res) => {
  try {
    const chartsView = await getChartView(req.params.mode, req.params.name);
    res.json(chartsView);
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

app.delete('/api/manage-charts-view/:mode/:name', async (req, res) => {
  try {
    const chartsView = await removeChartView(req.params.mode, req.params.name);
    res.json(chartsView);
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

app.post('/api/subscription-post-now/:mode', async (req, res) => {
  try {
    const mode = req.params.mode;
    const addedToManagerRequests = await addToContentManager(mode, req.body);
    res.json({ status: true });
  } catch (err) {
    res.json({ status: false });
    console.log(err);
  }
});

app.patch('/api/manage-key/:country/:keyId', async (req, res) => {
  try {
    const status = await updateKeyFromManager(req.params.country, req.params.keyId, req.body);
    res.json({ status });
  } catch(err) {
    res.json({ status: false });
    console.log(err);
  }
});

app.post('/api/manage-key/:country/', async (req, res) => {
  try {
    const status = await createKeyFromManager(req.params.country, req.body);
    res.json({ status });
  } catch(err) {
    res.json({ status: false });
    console.log(err);
  }
});


// Serve Vue.js as SPA in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'))
  app.get('*', (req, res, next) => {
    res.sendFile('index.html', {'root': path.join('./dist')})
  })
}