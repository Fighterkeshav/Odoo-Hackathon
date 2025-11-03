module.exports = (sequelize, DataTypes) => {
  const ItemTag = sequelize.define('ItemTag', {
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      }
    }
  }, {
    tableName: 'item_tags',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['item_id', 'tag_id']
      }
    ]
  });

  return ItemTag;
}; 