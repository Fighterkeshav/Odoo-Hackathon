const express = require('express');
const { Category, Size, Condition, Tag } = require('../models');

const router = express.Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// Get all sizes
router.get('/sizes', async (req, res) => {
  try {
    const sizes = await Size.findAll({
      order: [['label', 'ASC']]
    });
    res.json(sizes);
  } catch (error) {
    console.error('Get sizes error:', error);
    res.status(500).json({ message: 'Server error fetching sizes' });
  }
});

// Get all conditions
router.get('/conditions', async (req, res) => {
  try {
    const conditions = await Condition.findAll({
      order: [['label', 'ASC']]
    });
    res.json(conditions);
  } catch (error) {
    console.error('Get conditions error:', error);
    res.status(500).json({ message: 'Server error fetching conditions' });
  }
});

// Get all tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [['name', 'ASC']]
    });
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error fetching tags' });
  }
});

module.exports = router; 