import './loadEnv.js';
import express from 'express';
import cors from 'cors';
const { json } = express;
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import imageUpload from './routes/imageUpload.js'
import connectDB from './config/databaseFactory.js';
import mealRoutes from './routes/mealRoutes.js';
import logRoutes from './routes/logRoutes.js';
import foodRoutes from './routes/foodRoutes.js'
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api', userRoutes);
app.use('/api', mealRoutes);
app.use('/api', imageUpload);
app.use('/api', logRoutes);
app.use('/api', foodRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});