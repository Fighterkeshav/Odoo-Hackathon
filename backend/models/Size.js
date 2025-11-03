module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define('Size', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 10]
      }
    }
  }, {
    tableName: 'sizes',
    timestamps: false
  });

  return Size;
}; 