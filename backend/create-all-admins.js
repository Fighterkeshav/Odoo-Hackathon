const { User } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminUsers = [
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
  },
  {
    name: 'Keshav Fighter 2',
    email: 'fighterkeshav7@gmail.com',
    password: 'changeme123',
    bio: 'Admin user Keshav 2.',
    latitude: 41.8781,
    longitude: -87.6298,
    address: '789 Michigan Avenue',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    postal_code: '60601'
  }
];

async function createAllAdmins() {
  try {
    console.log('Connecting to database...');
    await require('./models').sequelize.authenticate();
    console.log('Database connection established successfully.');

    let createdCount = 0;
    let adminCount = 0;

    for (const userData of adminUsers) {
      try {
        const existing = await User.findOne({ where: { email: userData.email } });
        if (existing) {
          console.log(`User with email ${userData.email} already exists.`);
          if (!existing.is_admin) {
            await existing.update({ is_admin: true });
            console.log(`Made ${userData.email} an admin`);
            adminCount++;
          } else {
            console.log(`${userData.email} is already an admin`);
          }
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await User.create({
          name: userData.name,
          email: userData.email,
          password_hash: hashedPassword,
          bio: userData.bio,
          is_admin: true,
          latitude: userData.latitude,
          longitude: userData.longitude,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          postal_code: userData.postal_code
        });
        console.log(`Created admin user: ${userData.email}`);
        createdCount++;
        adminCount++;
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Created ${createdCount} new admin users`);
    console.log(`- Total admin users: ${adminCount}`);

  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await require('./models').sequelize.close();
    console.log('Database connection closed.');
  }
}

createAllAdmins(); 