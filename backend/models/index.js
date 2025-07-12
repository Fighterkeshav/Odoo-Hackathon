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
db.Category = require('./Category')(sequelize, Sequelize);
db.Size = require('./Size')(sequelize, Sequelize);
db.Condition = require('./Condition')(sequelize, Sequelize);
db.Tag = require('./Tag')(sequelize, Sequelize);
db.ItemImage = require('./ItemImage')(sequelize, Sequelize);
db.ItemTag = require('./ItemTag')(sequelize, Sequelize);
db.AdminAction = require('./AdminAction')(sequelize, Sequelize);
db.Wishlist = require('./Wishlist')(sequelize, Sequelize);

// User associations
db.User.hasMany(db.Item, { foreignKey: 'user_id', as: 'items' });
db.User.hasMany(db.Swap, { foreignKey: 'from_user_id', as: 'sentSwaps' });
db.User.hasMany(db.Swap, { foreignKey: 'to_user_id', as: 'receivedSwaps' });
db.User.hasMany(db.AdminAction, { foreignKey: 'admin_user_id', as: 'adminActions' });
db.User.hasMany(db.Wishlist, { foreignKey: 'user_id', as: 'wishlist' });

// Item associations
db.Item.belongsTo(db.User, { foreignKey: 'user_id', as: 'owner' });
db.Item.belongsTo(db.Category, { foreignKey: 'category_id', as: 'category' });
db.Item.belongsTo(db.Size, { foreignKey: 'size_id', as: 'size' });
db.Item.belongsTo(db.Condition, { foreignKey: 'condition_id', as: 'condition' });
db.Item.hasMany(db.ItemImage, { foreignKey: 'item_id', as: 'images' });
db.Item.hasMany(db.Swap, { foreignKey: 'requested_item_id', as: 'requestedSwaps' });
db.Item.hasMany(db.Swap, { foreignKey: 'offered_item_id', as: 'offeredSwaps' });
db.Item.hasMany(db.AdminAction, { foreignKey: 'item_id', as: 'adminActions' });
db.Item.hasMany(db.Wishlist, { foreignKey: 'item_id', as: 'wishlistedBy' });

// Many-to-many relationship between Items and Tags
db.Item.belongsToMany(db.Tag, { through: db.ItemTag, foreignKey: 'item_id', as: 'tags' });
db.Tag.belongsToMany(db.Item, { through: db.ItemTag, foreignKey: 'tag_id', as: 'items' });

// Swap associations
db.Swap.belongsTo(db.User, { foreignKey: 'from_user_id', as: 'fromUser' });
db.Swap.belongsTo(db.User, { foreignKey: 'to_user_id', as: 'toUser' });
db.Swap.belongsTo(db.Item, { foreignKey: 'requested_item_id', as: 'requestedItem' });
db.Swap.belongsTo(db.Item, { foreignKey: 'offered_item_id', as: 'offeredItem' });

// AdminAction associations
db.AdminAction.belongsTo(db.User, { foreignKey: 'admin_user_id', as: 'admin' });
db.AdminAction.belongsTo(db.Item, { foreignKey: 'item_id', as: 'item' });

// ItemImage associations
db.ItemImage.belongsTo(db.Item, { foreignKey: 'item_id', as: 'item' });

// Wishlist associations
db.Wishlist.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.Wishlist.belongsTo(db.Item, { foreignKey: 'item_id', as: 'item' });

module.exports = db; 