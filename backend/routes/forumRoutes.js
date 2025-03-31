const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/', forumController.getForums);
router.post('/', forumController.createForum);
router.get('/:forumId', forumController.getForumById);
router.put('/:forumId', forumController.updateForum);
router.delete('/:forumId', forumController.deleteForum);

module.exports = router;