const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { Item, User, Category, Size, Condition, ItemImage, Tag, ItemTag } = require('../models');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const GeminiService = require('../services/gemini');

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
    const allowedTypes = /jpeg|jpg|png|gif|webp|jepg/;
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
    const { category_id, size_id, condition_id, tag_id, search } = req.query;
    const whereClause = { status: 'Available' };

    // Apply filters
    if (category_id) whereClause.category_id = category_id;
    if (size_id) whereClause.size_id = size_id;
    if (condition_id) whereClause.condition_id = condition_id;
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { description: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    // Tag filter (many-to-many)
    let includeTags = [];
    if (tag_id) {
      includeTags = [{ model: Tag, as: 'tags', where: { id: tag_id } }];
    }

    const items = await Item.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'profile_image_url'] },
        { model: Category, as: 'category' },
        { model: Size, as: 'size' },
        { model: Condition, as: 'condition' },
        { model: ItemImage, as: 'images' },
        { model: Tag, as: 'tags', through: { attributes: [] } },
        ...includeTags
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
          attributes: ['id', 'name', 'bio']
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
router.post('/', authenticateToken, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'image', maxCount: 1 }
]), [
  body('title').isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category_id').toInt().isInt().withMessage('Valid category ID is required'),
  body('size_id').toInt().isInt().withMessage('Valid size ID is required'),
  body('condition_id').toInt().isInt().withMessage('Valid condition ID is required'),
  body('type').isIn(['Men', 'Women', 'Unisex', 'Kids']).withMessage('Invalid type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // Coerce IDs to integers
    const title = req.body.title;
    const description = req.body.description;
    const category_id = parseInt(req.body.category_id, 10);
    const size_id = parseInt(req.body.size_id, 10);
    const condition_id = parseInt(req.body.condition_id, 10);
    const type = req.body.type;
    let imageUrls = [];

    // Save images locally if provided
    if (req.files) {
      if (req.files['images']) {
        imageUrls = req.files['images'].map(file => `/uploads/${file.filename}`);
      } else if (req.files['image']) {
        imageUrls = req.files['image'].map(file => `/uploads/${file.filename}`);
      }
    }

    const item = await Item.create({
      title,
      description,
      category_id,
      size_id,
      condition_id,
      type,
      user_id: req.user.id,
      status: 'Under Review' // Items start as pending for admin approval
    });

    // Handle tags if provided
    if (req.body.tags) {
      let tagIds = [];
      if (Array.isArray(req.body.tags)) {
        tagIds = req.body.tags;
      } else if (typeof req.body.tags === 'string') {
        tagIds = req.body.tags.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }
      if (tagIds.length > 0) {
        await item.setTags(tagIds);
      }
    }

    // Create ItemImage records for uploaded images
    if (imageUrls.length > 0) {
      const ItemImage = require('../models').ItemImage;
      for (const imageUrl of imageUrls) {
        await ItemImage.create({
          item_id: item.id,
          image_url: imageUrl
        });
      }
    }

    const createdItem = await Item.findByPk(item.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'bio']
        },
        {
          model: Category,
          as: 'category'
        },
        {
          model: Size,
          as: 'size'
        },
        {
          model: Condition,
          as: 'condition'
        },
        {
          model: Tag,
          as: 'tags'
        },
        {
          model: ItemImage,
          as: 'images'
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