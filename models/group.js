const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const { User } = require("./users");

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Other group attributes...
});

module.exports = Group;
