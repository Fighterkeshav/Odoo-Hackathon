const express = require('express');
const { body, validationResult } = require('express-validator');
const { Swap, Item, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create swap or redeem request
router.post('/', authenticateToken, [
  body('item_id').isInt().withMessage('Valid item ID is required'),
  body('type').isIn(['swap', 'redeem']).withMessage('Type must be either swap or redeem')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { item_id, type } = req.body;
    const from_user_id = req.user.id;

    // Check if item exists and is available
    const item = await Item.findByPk(item_id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available for swap' });
    }

    if (item.owner_id === from_user_id) {
      return res.status(400).json({ message: 'Cannot swap your own item' });
    }

    // Check if user already has a pending swap for this item
    const existingSwap = await Swap.findOne({
      where: {
        item_id,
        from_user_id,
        status: 'pending'
      }
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'You already have a pending request for this item' });
    }

    // For redeem requests, check if user has enough points
    if (type === 'redeem') {
      const user = await User.findByPk(from_user_id);
      if (user.points_balance < 1) {
        return res.status(400).json({ message: 'Insufficient points for redemption' });
      }
    }

    // Create swap request
    const swap = await Swap.create({
      item_id,
      from_user_id,
      to_user_id: item.owner_id,
      type,
      status: 'pending'
    });

    const createdSwap = await Swap.findByPk(swap.id, {
      include: [
        {
          model: Item,
          as: 'item',
          include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }]
        },
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      message: `${type === 'redeem' ? 'Redemption' : 'Swap'} request created successfully`,
      swap: createdSwap
    });
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ message: 'Server error creating swap request' });
  }
});

// Get user's swap history
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const sentSwaps = await Swap.findAll({
      where: { from_user_id: req.user.id },
      include: [
        {
          model: Item,
          as: 'item',
          include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }]
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const receivedSwaps = await Swap.findAll({
      where: { to_user_id: req.user.id },
      include: [
        {
          model: Item,
          as: 'item',
          include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }]
        },
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      sentSwaps,
      receivedSwaps
    });
  } catch (error) {
    console.error('Get swap history error:', error);
    res.status(500).json({ message: 'Server error fetching swap history' });
  }
});

// Accept or reject swap request
router.put('/:id/respond', authenticateToken, [
  body('status').isIn(['accepted', 'rejected']).withMessage('Status must be either accepted or rejected')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const swap = await Swap.findByPk(req.params.id, {
      include: [
        {
          model: Item,
          as: 'item'
        },
        {
          model: User,
          as: 'fromUser'
        },
        {
          model: User,
          as: 'toUser'
        }
      ]
    });

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.to_user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request has already been processed' });
    }

    // Update swap status
    await swap.update({ status });

    // If accepted, handle the exchange
    if (status === 'accepted') {
      // Update item status to swapped
      await swap.item.update({ status: 'swapped' });

      // Handle points for redemption
      if (swap.type === 'redeem') {
        // Deduct point from redeemer
        await swap.fromUser.update({
          points_balance: swap.fromUser.points_balance - 1
        });

        // Add point to item owner
        await swap.toUser.update({
          points_balance: swap.toUser.points_balance + 1
        });
      }
    }

    const updatedSwap = await Swap.findByPk(swap.id, {
      include: [
        {
          model: Item,
          as: 'item',
          include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }]
        },
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'name', 'points_balance']
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'name', 'points_balance']
        }
      ]
    });

    res.json({
      message: `Swap request ${status} successfully`,
      swap: updatedSwap
    });
  } catch (error) {
    console.error('Respond to swap error:', error);
    res.status(500).json({ message: 'Server error responding to swap request' });
  }
});

// Cancel swap request (for the requester)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const swap = await Swap.findByPk(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.from_user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel a processed request' });
    }

    await swap.destroy();

    res.json({ message: 'Swap request cancelled successfully' });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ message: 'Server error cancelling swap request' });
  }
});

module.exports = router; 