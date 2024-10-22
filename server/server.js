import './loadEnv.js';
import express from 'express';
import cors from 'cors';
const { json } = express;
import userRoutes from './routes/userRoutes.js';
import imageUpload from './routes/imageUpload.js'
import connectDB from './config/databaseFactory.js';
import mealRoutes from './routes/mealRoutes.js';
connectDB();

console.log(process.env.MONGO_URI)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api', userRoutes);
app.use('/api', mealRoutes)

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//node server.js