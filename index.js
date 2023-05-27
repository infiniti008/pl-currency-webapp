import * as dotenv from 'dotenv';
dotenv.config({
  debug: true,
  path: './.env'
});

import express from 'express';
import cors from 'cors';
import { getLastCurrencies, initBase, updateFavorites, getSettings, updateSettings, saveMessage } from './server/base.js';
import bodyParser from 'body-parser';
// import cookieParser from'cookie-parser';

const app = express();
const port = 3000;
const allowedDomain = 'https://localhost:3301';
const corsOptions = {
  origin: allowedDomain,
};
// app.use(cookieParser());

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   if (req.path === '/') {
//     res.cookie('defaultCountry', 'pl', {expire: 360000 + Date.now()});
//   }
//   next();
// });

// Serve static files from the 'public' directory
app.use(express.static('./dist'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  initBase();
});

app.get('/api/last/:country/:userid', async (req, res) => {
  try {
    const { data, settings } = await getLastCurrencies(req.params.country, req.params.userid);
    res.json({ data, settings });
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/settings/:userid', async (req, res) => {
  try {
    const data = await getSettings(req.params.userid);
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/favorites/:country/:userid', async (req, res) => {
  try {
    await updateFavorites(req.body.favorites, req.params.country, req.params.userid);
    res.send('OK');
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/settings/:userid', async (req, res) => {
  try {
    await updateSettings(req.body.settings, req.params.userid);
    res.send('OK');
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/message/:userid', async (req, res) => {
  try {
    const response = await saveMessage(req.body.message, req.params.userid);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});