const { Category, Size, Condition, Tag } = require('../models');

const seedInitialData = async () => {
  try {
    // Seed Categories
    const categories = [
      { name: 'Tops' },
      { name: 'Bottoms' },
      { name: 'Dresses' },
      { name: 'Outerwear' },
      { name: 'Shoes' },
      { name: 'Accessories' }
    ];

    for (const category of categories) {
      await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }

    // Seed Sizes
    const sizes = [
      { label: 'XS' },
      { label: 'S' },
      { label: 'M' },
      { label: 'L' },
      { label: 'XL' },
      { label: 'XXL' },
      { label: 'One Size' }
    ];

    for (const size of sizes) {
      await Size.findOrCreate({
        where: { label: size.label },
        defaults: size
      });
    }

    // Seed Conditions
    const conditions = [
      { label: 'New' },
      { label: 'Like New' },
      { label: 'Good' },
      { label: 'Fair' },
      { label: 'Poor' }
    ];

    for (const condition of conditions) {
      await Condition.findOrCreate({
        where: { label: condition.label },
        defaults: condition
      });
    }

    // Seed Tags
    const tags = [
      { name: 'Vintage' },
      { name: 'Sustainable' },
      { name: 'Designer' },
      { name: 'Casual' },
      { name: 'Formal' },
      { name: 'Sportswear' },
      { name: 'Denim' },
      { name: 'Leather' },
      { name: 'Wool' },
      { name: 'Cotton' },
      { name: 'Silk' },
      { name: 'Linen' },
      { name: 'Summer' },
      { name: 'Winter' },
      { name: 'Spring' },
      { name: 'Fall' }
    ];

    for (const tag of tags) {
      await Tag.findOrCreate({
        where: { name: tag.name },
        defaults: tag
      });
    }

    console.log('✅ Initial data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding initial data:', error);
  }
};

module.exports = seedInitialData; 