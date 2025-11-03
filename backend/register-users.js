const { User } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const usersToRegister = [
  {
    name: 'Danny Holmes',
    email: 'dannyholmes943@gmail.com',
    password: 'changeme123',
    bio: 'Admin user Danny.',
    latitude: 40.7128,
    longitude: -74.0060,
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postal_code: '10001'
  },
  {
    name: 'Keshav Fighter',
    email: 'fighterkeshav8@gmail.com',
    password: 'changeme123',
    bio: 'Admin user Keshav.',
    latitude: 34.0522,
    longitude: -118.2437,
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    postal_code: '90210'
  }
];

async function registerUsers() {
  try {
    console.log('Connecting to database...');
    await require('./models').sequelize.authenticate();
    console.log('Database connection established successfully.');

    for (const userData of usersToRegister) {
      const existing = await User.findOne({ where: { email: userData.email } });
      if (existing) {
        console.log(`User with email ${userData.email} already exists. Skipping.`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        name: userData.name,
        email: userData.email,
        password_hash: hashedPassword,
        bio: userData.bio,
        is_admin: false,
        latitude: userData.latitude,
        longitude: userData.longitude,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        postal_code: userData.postal_code
      });
      console.log(`Registered user: ${userData.email}`);
    }
  } catch (error) {
    console.error('Error registering users:', error.message);
  } finally {
    await require('./models').sequelize.close();
    console.log('Database connection closed.');
  }
}

registerUsers(); 