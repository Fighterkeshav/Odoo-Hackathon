const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
console.log('Testing connection to:', databaseUrl);

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test creating the database if it doesn't exist
    const dbName = 'rewear_db';
    const tempSequelize = new Sequelize('postgres', 'postgres', 'keshavagrawal', {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false
    });
    
    try {
      await tempSequelize.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully!`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Database '${dbName}' already exists!`);
      } else {
        console.log(`⚠️  Could not create database: ${error.message}`);
      }
    }
    
    await tempSequelize.close();
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection(); 