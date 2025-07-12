const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const db = require('./models');
const { sequelize } = require('./models');

// Passport configuration
require('./config/passport');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/swaps', require('./routes/swaps'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/meta', require('./routes/meta'));
app.use('/api/location', require('./routes/location'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ReWear API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Sync database and start server
sequelize.sync({ alter: true }).then(async () => {
  console.log('Database synced');
  
  // Seed initial data
  const seedInitialData = require('./seeders/initial-data');
  await seedInitialData();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 