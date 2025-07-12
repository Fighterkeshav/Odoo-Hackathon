module.exports = (sequelize, DataTypes) => {
  const Swap = sequelize.define('Swap', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    from_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    to_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    requested_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    offered_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    points_offered: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending'
    }
  }, {
    tableName: 'swap_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Swap;
}; 