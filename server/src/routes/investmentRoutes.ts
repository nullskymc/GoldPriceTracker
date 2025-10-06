import { Router } from 'express';
import db from '../database/db';

const router = Router();

interface Investment {
  id: number;
  grams: number;
  totalCostRmb: number;
  createdAt: string;
}

router.post('/', (req, res) => {
  try {
    const { grams, totalCostRmb } = req.body;

    if (!grams || !totalCostRmb || grams <= 0 || totalCostRmb <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input: grams and totalCostRmb must be positive numbers' 
      });
    }

    const stmt = db.prepare('INSERT INTO investments (grams, totalCostRmb) VALUES (?, ?)');
    const result = stmt.run(grams, totalCostRmb);

    res.json({ 
      success: true, 
      message: 'Investment saved successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error saving investment:', error);
    res.status(500).json({ success: false, message: 'Failed to save investment' });
  }
});

router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM investments ORDER BY createdAt DESC');
    const investments = stmt.all() as Investment[];
    res.json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM investments WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    res.json({ success: true, message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete investment' });
  }
});

export default router;
