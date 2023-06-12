const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Message = sequelize.define("message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  isFile: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Message;
