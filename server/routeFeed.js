import express from 'express';
const router = express.Router();

import { 
  getFeed
} from './base.js';

router.get('/:offset/:limit', async (req, res) => {
  const mode = req.headers['x-mode'];
  const limit = Number(req.params.limit) || 10;
  const offset = Number(req.params.offset) || 0;
  const data = await getFeed(limit, offset, mode);
  
  res.json(data);
});

export default router;