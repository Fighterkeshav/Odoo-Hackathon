#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎉 Welcome to ReWear Setup!');
console.log('This script will help you set up the project and create an admin user.\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  try {
    // Check if .env exists
    const envPath = path.join(__dirname, 'backend', '.env');
    if (!fs.existsSync(envPath)) {
      console.log('📝 Creating .env file...');
      const envContent = `JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
PORT=5000
DATABASE_URL=sqlite://./database.sqlite
MAX_FILE_SIZE=5242880
UPLOAD_PATH=../uploads
CORS_ORIGIN=http://localhost:3000
`;
      fs.writeFileSync(envPath, envContent);
      console.log('✅ .env file created successfully!');
    } else {
      console.log('✅ .env file already exists');
    }

    // Create uploads directory if it doesn't exist
    const uploadsPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log('✅ Uploads directory created');
    } else {
      console.log('✅ Uploads directory already exists');
    }

    console.log('\n📦 Next steps:');
    console.log('1. Install backend dependencies: cd backend && npm install');
    console.log('2. Install frontend dependencies: cd frontend && npm install');
    console.log('3. Start the backend: cd backend && npm run dev');
    console.log('4. Start the frontend: cd frontend && npm start');
    console.log('\n🌐 The application will be available at:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend: http://localhost:5000');

    console.log('\n👤 To create an admin user:');
    console.log('1. Start the application');
    console.log('2. Register a new account');
    console.log('3. Use the admin panel to promote your user to admin');

    rl.close();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

setup(); 