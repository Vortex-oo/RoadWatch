const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const reportController = require('./controllers/reportController');
const app = express();

app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_demo';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mount the auth routes
app.use('/auth', authRoutes);

// Mount the reports routes
app.use('/reports', reportRoutes);

// Mount the standalone stats route directly
app.get('/stats', reportController.getStats);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});