import express from 'express';
import cors from 'cors';
const { json } = express;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // To allow requests from React frontend
app.use(json()); // To parse JSON request bodies

// Define a simple route
app.get('/api/greet', (req, res) => {
    res.json({ message: 'Hello from Express backend!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//node server.js