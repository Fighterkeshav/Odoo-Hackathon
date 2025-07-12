const { User } = require('./models');
require('dotenv').config();

async function listUsers() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await require('./models').sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'is_admin', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    
    console.log(`\n📋 Found ${users.length} users in the database:\n`);
    
    users.forEach((user, index) => {
      const adminStatus = user.is_admin ? '👑 ADMIN' : '👤 USER';
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${adminStatus}`);
    });
    
    // Check for similar emails
    console.log('\n🔍 Checking for similar email addresses...');
    const targetEmails = [
      'dannyholmes943@gmail.com',
      'fighterkeshav8@gmail.com',
      'fighterkeshav7@gmail.com'
    ];
    
    targetEmails.forEach(targetEmail => {
      const similarUsers = users.filter(user => 
        user.email.toLowerCase().includes(targetEmail.split('@')[0].toLowerCase())
      );
      
      if (similarUsers.length > 0) {
        console.log(`\nSimilar to ${targetEmail}:`);
        similarUsers.forEach(user => {
          console.log(`  - ${user.email} (${user.name})`);
        });
      } else {
        console.log(`\nNo users found similar to ${targetEmail}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    // Close database connection
    await require('./models').sequelize.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
listUsers(); 