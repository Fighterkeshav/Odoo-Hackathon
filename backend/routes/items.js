const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { Item, User } = require('../models');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all public items (available for viewing)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, size, condition, search } = req.query;
    const whereClause = { status: 'available' };

    // Apply filters
    if (category) whereClause.category = category;
    if (size) whereClause.size = size;
    if (condition) whereClause.condition = condition;
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const items = await Item.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error fetching items' });
  }
});

// Get single item
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error fetching item' });
  }
});

// Create new item
router.post('/', authenticateToken, upload.single('image'), [
  body('title').isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories']).withMessage('Invalid category'),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']).withMessage('Invalid size'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, size, condition } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await Item.create({
      title,
      description,
      category,
      size,
      condition,
      image_url: imageUrl,
      owner_id: req.user.id,
      status: 'pending' // Items start as pending for admin approval
    });

    const createdItem = await Item.findByPk(item.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'location']
        }
      ]
    });

    res.status(201).json({
      message: 'Item created successfully',
      item: createdItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error creating item' });
  }
});

// Update item status (for item owner)
router.put('/:id/status', authenticateToken, [
  body('status').isIn(['available', 'swapped']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    await item.update({ status: req.body.status });

    res.json({
      message: 'Item status updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item status error:', error);
    res.status(500).json({ message: 'Server error updating item status' });
  }
});

// Delete item (for item owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // Delete image file if exists
    if (item.image_url) {
      const imagePath = path.join(__dirname, '../..', item.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await item.destroy();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error deleting item' });
  }
});

module.exports = router; 