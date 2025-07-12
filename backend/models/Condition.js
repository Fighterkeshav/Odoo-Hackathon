module.exports = (sequelize, DataTypes) => {
  const Condition = sequelize.define('Condition', {
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
        len: [1, 20]
      }
    }
  }, {
    tableName: 'conditions',
    timestamps: false
  });

  return Condition;
}; 