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
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/swaps', require('./routes/swaps'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/meta', require('./routes/meta'));
app.use('/api/location', require('./routes/location'));
console.log('Routes loaded successfully');

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ReWear API is running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      items: '/api/items',
      swaps: '/api/swaps',
      admin: '/api/admin',
      wishlist: '/api/wishlist',
      meta: '/api/meta',
      location: '/api/location'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ReWear API is running' });
});

// Debug endpoint to check configuration
app.get('/api/debug/config', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtConfigured: !!process.env.JWT_SECRET,
    googleOAuthConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'Not set',
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'Not set',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    timestamp: new Date().toISOString()
  });
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

// Start server first, then sync database
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
  
  // Sync database after server starts
  sequelize.sync({ alter: true })
    .then(async () => {
      console.log('Database synced successfully');
      
      // Seed initial data
      try {
        const seedInitialData = require('./seeders/initial-data');
        await seedInitialData();
        console.log('Initial data seeded');
      } catch (seedError) {
        console.error('Error seeding data:', seedError.message);
      }
    })
    .catch(err => {
      console.error('Database sync error:', err.message);
    });
}); 