const { sequelize, Category, Size, Condition, Tag } = require('../models');

async function seedData() {
  try {
    console.log('Starting database seeding...');

    // Seed Categories
    const categories = [
      'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'
    ];

    for (const categoryName of categories) {
      await Category.findOrCreate({
        where: { name: categoryName }
      });
    }
    console.log('Categories seeded successfully');

    // Seed Sizes
    const sizes = [
      'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size',
      '28W', '30W', '32W', '34W', '36W', '38W', '40W',
      '6Y', '8Y', '10Y', '12Y', '14Y', '16Y'
    ];

    for (const sizeLabel of sizes) {
      await Size.findOrCreate({
        where: { label: sizeLabel }
      });
    }
    console.log('Sizes seeded successfully');

    // Seed Conditions
    const conditions = [
      'New', 'Like New', 'Good', 'Fair', 'Poor'
    ];

    for (const conditionLabel of conditions) {
      await Condition.findOrCreate({
        where: { label: conditionLabel }
      });
    }
    console.log('Conditions seeded successfully');

    // Seed Tags
    const tags = [
      'Vintage', 'Casual', 'Formal', 'Summer', 'Winter', 'Spring', 'Fall',
      'Denim', 'Leather', 'Cotton', 'Silk', 'Wool', 'Synthetic',
      'Trendy', 'Classic', 'Sporty', 'Elegant', 'Bohemian', 'Minimalist'
    ];

    for (const tagName of tags) {
      await Tag.findOrCreate({
        where: { name: tagName }
      });
    }
    console.log('Tags seeded successfully');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData(); 