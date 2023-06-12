const express = require("express");
const authenticateUser = require("../middlewares/authenticateUser");
const {
  createGroup,
  getUserAllGroup,
  addUserToGroup,
  removeUserFromGroup,
  findAllUsersInGroup,
  findGroupNameByGroupId,
} = require("../controllers/groupController");
const router = express.Router();

router.post("/creategroup", authenticateUser, createGroup);
router.get("/usergroups", authenticateUser, getUserAllGroup);
router.post("/adduserToGroup", addUserToGroup);
router.post("/removeUserFromGroup", removeUserFromGroup);
router.post("/findAllUsersInGroup", findAllUsersInGroup);
router.post("/findGroupNameByGroupId", findGroupNameByGroupId);
module.exports = router;
