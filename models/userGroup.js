const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Group = require("./group");
const { User } = require("./users");
const Message = require("./messageModel");

const userGroup = sequelize.define("usergroup", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// User.belongsToMany(Group, { through: userGroup });
// Group.belongsToMany(User, { through: userGroup });
User.hasMany(Group, { foreignKey: "user_id" });

Group.belongsTo(User);
Group.hasMany(userGroup, { foreignKey: "group_id" });
userGroup.belongsTo(Group);
User.hasMany(userGroup, { foreignKey: "user_id" });
userGroup.belongsTo(User);
userGroup.hasMany(Message, { foreignKey: "group_id" });
Message.belongsTo(userGroup);
(async () => {
  try {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to synchronize the models:", error);
  }
})();

module.exports = userGroup;
