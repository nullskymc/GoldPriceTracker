import express from 'express';
import cors from 'cors';
import goldRoutes from './routes/goldRoutes';
import investmentRoutes from './routes/investmentRoutes';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.use('/api/gold', goldRoutes);
app.use('/api/investments', investmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
