module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 1000]
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('Men', 'Women', 'Unisex', 'Kids'),
      allowNull: false
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sizes',
        key: 'id'
      }
    },
    condition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'conditions',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('Available', 'Swapped', 'Redeemed', 'Under Review', 'Rejected'),
      allowNull: false,
      defaultValue: 'Under Review'
    },
    ai_analyzed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ai_suggestions: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Item;
}; 