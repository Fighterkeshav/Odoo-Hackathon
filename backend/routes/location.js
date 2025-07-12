const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Item } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Get nearby users within a specified radius
router.get('/nearby-users', authenticateToken, [
  body('radius').optional().isFloat({ min: 1, max: 100 }).withMessage('Radius must be between 1 and 100 km')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const radius = parseFloat(req.query.radius) || 10; // Default 10km radius
    const currentUser = await User.findByPk(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all users except current user
    const allUsers = await User.findAll({
      where: {
        id: { [require('sequelize').Op.ne]: req.user.id }
      },
      attributes: ['id', 'name', 'email', 'bio', 'latitude', 'longitude', 'city', 'state', 'country']
    });

    // Filter users within radius
    const nearbyUsers = allUsers.filter(user => {
      const distance = calculateDistance(
        currentUser.latitude, 
        currentUser.longitude, 
        user.latitude, 
        user.longitude
      );
      return distance <= radius;
    }).map(user => {
      const distance = calculateDistance(
        currentUser.latitude, 
        currentUser.longitude, 
        user.latitude, 
        user.longitude
      );
      return {
        ...user.toJSON(),
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      };
    }).sort((a, b) => a.distance - b.distance);

    res.json({
      nearbyUsers,
      currentLocation: {
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
        city: currentUser.city,
        state: currentUser.state,
        country: currentUser.country
      },
      radius
    });
  } catch (error) {
    console.error('Get nearby users error:', error);
    res.status(500).json({ message: 'Server error fetching nearby users' });
  }
});

// Get nearby items within a specified radius
router.get('/nearby-items', authenticateToken, [
  body('radius').optional().isFloat({ min: 1, max: 100 }).withMessage('Radius must be between 1 and 100 km')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const radius = parseFloat(req.query.radius) || 10; // Default 10km radius
    const currentUser = await User.findByPk(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all available items with their owners
    const allItems = await Item.findAll({
      where: { status: 'Available' },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'latitude', 'longitude', 'city', 'state', 'country']
        }
      ]
    });

    // Filter items within radius
    const nearbyItems = allItems.filter(item => {
      const distance = calculateDistance(
        currentUser.latitude, 
        currentUser.longitude, 
        item.owner.latitude, 
        item.owner.longitude
      );
      return distance <= radius;
    }).map(item => {
      const distance = calculateDistance(
        currentUser.latitude, 
        currentUser.longitude, 
        item.owner.latitude, 
        item.owner.longitude
      );
      return {
        ...item.toJSON(),
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      };
    }).sort((a, b) => a.distance - b.distance);

    res.json({
      nearbyItems,
      currentLocation: {
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
        city: currentUser.city,
        state: currentUser.state,
        country: currentUser.country
      },
      radius
    });
  } catch (error) {
    console.error('Get nearby items error:', error);
    res.status(500).json({ message: 'Server error fetching nearby items' });
  }
});

// Update user location
router.put('/update-location', authenticateToken, [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('city').isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('country').isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
  body('address').optional().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('state').optional().isLength({ min: 2, max: 50 }).withMessage('State must be between 2 and 50 characters'),
  body('postal_code').optional().isLength({ min: 3, max: 10 }).withMessage('Postal code must be between 3 and 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      latitude, 
      longitude, 
      city, 
      country,
      address, 
      state, 
      postal_code 
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only update fields that are provided
    const updateData = {
      latitude,
      longitude,
      city,
      country
    };

    if (address) updateData.address = address;
    if (state) updateData.state = state;
    if (postal_code) updateData.postal_code = postal_code;

    await user.update(updateData);

    res.json({
      message: 'Location updated successfully',
      user: {
        id: user.id,
        latitude: user.latitude,
        longitude: user.longitude,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        postal_code: user.postal_code
      }
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error updating location' });
  }
});

module.exports = router; 