const express = require('express');
const { body, validationResult } = require('express-validator');
const { Wishlist, Item, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'name', 'profile_image_url']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
});

// Add item to wishlist
router.post('/', authenticateToken, [
  body('item_id').isInt().withMessage('Valid item ID is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { item_id, notes, priority = 'medium' } = req.body;

    // Check if item exists
    const item = await Item.findByPk(item_id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      where: { user_id: req.user.id, item_id }
    });

    if (existingWishlist) {
      return res.status(400).json({ message: 'Item is already in your wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user_id: req.user.id,
      item_id,
      notes,
      priority
    });

    const createdWishlistItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'name', 'profile_image_url']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Item added to wishlist successfully',
      wishlistItem: createdWishlistItem
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
});

// Update wishlist item
router.put('/:id', authenticateToken, [
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { notes, priority } = req.body;
    const wishlistItem = await Wishlist.findByPk(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    if (wishlistItem.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this wishlist item' });
    }

    await wishlistItem.update({ notes, priority });

    const updatedWishlistItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'name', 'profile_image_url']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Wishlist item updated successfully',
      wishlistItem: updatedWishlistItem
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({ message: 'Server error updating wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findByPk(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    if (wishlistItem.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove this wishlist item' });
    }

    await wishlistItem.destroy();

    res.json({ message: 'Item removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
});

// Check if item is in user's wishlist
router.get('/check/:itemId', authenticateToken, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      where: { user_id: req.user.id, item_id: req.params.itemId }
    });

    res.json({ inWishlist: !!wishlistItem, wishlistItem });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ message: 'Server error checking wishlist' });
  }
});

module.exports = router; 