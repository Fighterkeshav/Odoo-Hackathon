module.exports = (sequelize, DataTypes) => {
  const AdminAction = sequelize.define('AdminAction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    admin_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    action_type: {
      type: DataTypes.ENUM('approved', 'rejected', 'removed'),
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'admin_actions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return AdminAction;
}; 