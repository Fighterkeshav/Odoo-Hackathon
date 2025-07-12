const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
  throw new Error('DATABASE_URL must be set to a valid PostgreSQL connection string.');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3,
    timeout: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Item = require('./Item')(sequelize, Sequelize);
db.Swap = require('./Swap')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Item, { foreignKey: 'owner_id', as: 'items' });
db.Item.belongsTo(db.User, { foreignKey: 'owner_id', as: 'owner' });

db.Item.hasMany(db.Swap, { foreignKey: 'item_id', as: 'swaps' });
db.Swap.belongsTo(db.Item, { foreignKey: 'item_id', as: 'item' });

db.User.hasMany(db.Swap, { foreignKey: 'from_user_id', as: 'sentSwaps' });
db.User.hasMany(db.Swap, { foreignKey: 'to_user_id', as: 'receivedSwaps' });
db.Swap.belongsTo(db.User, { foreignKey: 'from_user_id', as: 'fromUser' });
db.Swap.belongsTo(db.User, { foreignKey: 'to_user_id', as: 'toUser' });

module.exports = db; 