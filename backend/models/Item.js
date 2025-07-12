module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    category: {
      type: DataTypes.ENUM('tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'),
      allowNull: false
    },
    size: {
      type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'),
      allowNull: false
    },
    condition: {
      type: DataTypes.ENUM('new', 'like-new', 'good', 'fair', 'poor'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'available', 'swapped'),
      allowNull: false,
      defaultValue: 'pending'
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Item;
}; 