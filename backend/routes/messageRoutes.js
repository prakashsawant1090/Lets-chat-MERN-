const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

// protect is used for only access by logged in user
router.route("/").post(protect, sendMessage); // api for sending messages
router.route("/:chatId").get(protect, allMessages); // fetch all messages for particular chat

module.exports = router;
