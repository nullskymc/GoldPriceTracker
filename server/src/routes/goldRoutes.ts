import { Router } from 'express';
import { getGoldPrice } from '../services/goldService';

const router = Router();

router.get('/price', async (req, res) => {
  try {
    const priceData = await getGoldPrice();
    res.json(priceData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
});

export default router;
