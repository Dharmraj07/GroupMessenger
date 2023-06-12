const Group = require("../models/group");
const { User } = require("../models/users");

const { Op } = require("sequelize");
const { fn, col } = require("sequelize");

// Import required packages and models
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const userGroup = require("../models/userGroup");

async function findGroupNameByGroupId(req, res) {
  try {
    const { group_id } = req.body;

    const group = await Group.findOne({
      where: {
        id: group_id,
      },
      attributes: ["groupName"],
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(group.groupName);
  } catch (error) {
    console.error("Error finding group name:", error);
    res.status(500).json({ error: "Unable to find group name" });
  }
}

async function findAllUsersInGroup(req, res) {
  try {
    const { group_id } = req.body;

    const userGroupData = await userGroup.findAll({
      where: {
        group_id: {
          [Op.eq]: group_id,
        },
      },
      attributes: ["user_id"],
    });
    // Extract user IDs from userGroupData
    const userIds = userGroupData.map((item) => item.user_id);

    // Find usernames associated with the user IDs
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: userIds,
        },
      },
      attributes: ["username"],
    });

    // Extract usernames from the users result
    const usernames = users.map((user) => user.username);

    res.json(usernames);

    // res.json(userGroupData);
  } catch (error) {
    console.error("Error finding user IDs:", error);
    res.status(500).json({ error: "Unable to find user IDs" });
  }
}

async function createGroup(req, res) {
  try {
    const { groupName } = req.body;
    const userId = req.user.id; // Assuming you have user authentication and the authenticated user's ID is available in req.user.id

    const group = await Group.create({
      groupName,
      user_id: userId, // Use UserId instead of user_id as the foreign key column name
    });
    console.log(group.id);
    await userGroup.create({
      group_id: group.id,
      user_id: userId,
      groupName: group.groupName,

      admin: true,
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Unable to create group" });
  }
}

async function getUserAllGroup(req, res) {
  try {
    // Assuming the group ID is sent as a parameter in the request
    const user_id = req.user.id;

    const allGroups = await userGroup.findAll({
      where: {
        user_id,
      },
    });

    res.status(200).json(allGroups);
  } catch (error) {
    console.error("Error getting users in group:", error);
    res.status(500).json({ error: "Unable to get users in group" });
  }
}

async function addUserToGroup(req, res) {
  const { group_id, user_id, email, admin } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    const id = group_id;
    const group = await Group.findByPk(id);
    if (!group || !user) {
      return res.json({ success: false, message: "Group or user not found" });
    }

    const isAdmin = await userGroup.findOne({
      where: { group_id, user_id, admin: true },
    });

    if (!isAdmin) {
      return res.json({
        success: false,
        message: "Only admins can add users to the group",
      });
    }

    const isGroup = await userGroup.findOne({
      where: {
        group_id,
        user_id: user.id,
      },
    });

    if (isGroup) {
      return res.json({ success: false, message: "user is already in Group" });
    }
    const response = await userGroup.create({
      groupName: group.groupName,
      group_id,
      user_id: user.id,
      admin,
    });

    console.log();

    res.json({ response, group, message: "a user added successfuly" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Unable to add the user to the group" });
  }
}

async function removeUserFromGroup(req, res) {
  const { group_id, user_id, email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    const id = group_id;
    const group = await Group.findByPk(id);
    if (!group || !user) {
      return res.json({ success: false, message: "Group or user not found" });
    }

    const isAdmin = await userGroup.findOne({
      where: { group_id, user_id, admin: true },
    });

    if (!isAdmin) {
      return res.json({
        success: false,
        message: "Only admins can add users to the group",
      });
    }

    const isGroup = await userGroup.findOne({
      where: {
        [Op.and]: [{ group_id }, { user_id: user.id }, { admin: true }],
        // group_id,
        // user_id: user.id,
      },
    });
    console.log(isGroup);
    if (!isGroup) {
      return res.json({ success: false, message: "user is not in Group" });
    }
    // const response = await userGroup.create({
    //   groupName: group.groupName,
    //   group_id,
    //   user_id: user.id,
    //   admin,
    // });

    // console.log();
    await isGroup.destroy();
    res.json({ group, message: "User removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Unable to remove the user from the group",
      });
  }
}

module.exports = {
  getUserAllGroup,
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  findAllUsersInGroup,
  findGroupNameByGroupId,
};
