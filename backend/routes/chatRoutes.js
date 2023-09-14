const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatControllers');
const router = express.Router();

router.route('/').post(protect,accessChat); // list the most recent one on one chats
router.route('/').get(protect, fetchChats); // list the all chats for user
router.route('/group').post(protect, createGroupChat); //to create a new chat group
router.route('/rename').put(protect, renameGroup); 
router.route('/groupadd').put(protect, addToGroup);
router.route('/groupremove').put(protect, removeFromGroup);

module.exports = router;