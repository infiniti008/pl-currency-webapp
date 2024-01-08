import express from 'express';
const router = express.Router();

import { 
  findSubscriptionById, getDiffCurrencies
} from './base.js';

router.get('/subscription/:id', async (req, res) => {
  const mode = req.headers['x-mode'];
  const data = await findSubscriptionById(req.params.id, mode);
  
  res.json(data);
});

router.post('/currencies/diff', async (req, res) => {
  const { country, keys, timestamp } = req.body;
  const data = await getDiffCurrencies(country, keys, timestamp);
  
  res.json(data);
});

export default router;