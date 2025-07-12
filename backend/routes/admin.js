const express = require('express');
const { body, validationResult } = require('express-validator');
const { Item, User, Swap } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all items for admin review
router.get('/items', async (req, res) => {
  try {
    const { status, category } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const items = await Item.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'location']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    console.error('Admin get items error:', error);
    res.status(500).json({ message: 'Server error fetching items' });
  }
});

// Approve or reject item
router.put('/items/:id/approve', [
  body('status').isIn(['available', 'rejected']).withMessage('Status must be either available or rejected')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner' }]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ message: 'Item has already been processed' });
    }

    // Update item status
    await item.update({ status });

    // If approved, give point to the owner
    if (status === 'available') {
      await item.owner.update({
        points: item.owner.points + 1
      });
    }

    const updatedItem = await Item.findByPk(item.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'location', 'points']
        }
      ]
    });

    res.json({
      message: `Item ${status === 'available' ? 'approved' : 'rejected'} successfully`,
      item: updatedItem
    });
  } catch (error) {
    console.error('Admin approve item error:', error);
    res.status(500).json({ message: 'Server error processing item' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'location', 'points', 'is_admin', 'created_at'],
      include: [
        {
          model: Item,
          as: 'items',
          attributes: ['id', 'title', 'status', 'created_at']
        },
        {
          model: Swap,
          as: 'sentSwaps',
          attributes: ['id', 'type', 'status', 'created_at']
        },
        {
          model: Swap,
          as: 'receivedSwaps',
          attributes: ['id', 'type', 'status', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Update user admin status
router.put('/users/:id/admin', [
  body('is_admin').isBoolean().withMessage('is_admin must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { is_admin } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from removing their own admin status
    if (user.id === req.user.id && !is_admin) {
      return res.status(400).json({ message: 'Cannot remove your own admin status' });
    }

    await user.update({ is_admin });

    res.json({
      message: `User admin status updated successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalItems = await Item.count();
    const pendingItems = await Item.count({ where: { status: 'pending' } });
    const availableItems = await Item.count({ where: { status: 'available' } });
    const swappedItems = await Item.count({ where: { status: 'swapped' } });
    const totalSwaps = await Swap.count();
    const pendingSwaps = await Swap.count({ where: { status: 'pending' } });

    // Get recent activity
    const recentItems = await Item.findAll({
      include: [{ model: User, as: 'owner', attributes: ['name'] }],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const recentSwaps = await Swap.findAll({
      include: [
        { model: Item, as: 'item', attributes: ['title'] },
        { model: User, as: 'fromUser', attributes: ['name'] },
        { model: User, as: 'toUser', attributes: ['name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalUsers,
        totalItems,
        pendingItems,
        availableItems,
        swappedItems,
        totalSwaps,
        pendingSwaps
      },
      recentActivity: {
        items: recentItems,
        swaps: recentSwaps
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

module.exports = router; 