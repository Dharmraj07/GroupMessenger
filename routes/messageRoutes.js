const express = require("express");
const {
  storeMessage,
  getMessagesByGroupId,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/messages", storeMessage);
router.post("/getmessages", getMessagesByGroupId);

module.exports = router;
