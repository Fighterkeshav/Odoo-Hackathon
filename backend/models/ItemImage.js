module.exports = (sequelize, DataTypes) => {
  const ItemImage = sequelize.define('ItemImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'item_images',
    timestamps: false
  });

  return ItemImage;
}; 