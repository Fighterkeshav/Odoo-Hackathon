const { User } = require('./models');
require('dotenv').config();

const adminEmails = [
  'dannyholmes943@gmail.com',
  'fighterkeshav8@gmail.com'
];

async function makeUsersAdmin() {
  try {
    console.log('Connecting to database...');
    
    // Test database connection
    await require('./models').sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    let updatedCount = 0;
    
    for (const email of adminEmails) {
      try {
        const user = await User.findOne({ where: { email } });
        
        if (user) {
          if (user.is_admin) {
            console.log(`✅ ${email} is already an admin`);
          } else {
            await user.update({ is_admin: true });
            console.log(`✅ Made ${email} an admin`);
            updatedCount++;
          }
        } else {
          console.log(`❌ User with email ${email} not found`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${email}:`, error.message);
      }
    }
    
    console.log(`\n📊 Summary: ${updatedCount} users were made admin`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    // Close database connection
    await require('./models').sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the script
makeUsersAdmin(); 