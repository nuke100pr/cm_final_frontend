const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController2');
const multer = require('multer');

const upload = multer({
storage: multer.memoryStorage(),
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Forum CRUD Routes
router.post('/forums',upload.single('image'), forumController.createForum);
router.get('/api/forums', forumController.getAllForums);
router.get('/forums/:id', forumController.getForumById);
router.put('/forums/:id', forumController.updateForum);
router.delete('/forums/:id', forumController.deleteForum);

// Forum Member Routes
router.post('/forums/:forumId/members', forumController.addForumMember);
router.get('/forums/:forumId/members', forumController.getForumMembers);
router.delete('/forums/:forumId/members/:userId', forumController.removeForumMember);

// Forum Ban Routes
router.post('/forums/:forumId/bans', forumController.banForumMember);
router.get('/forums/:forumId/bans', forumController.getForumBans);
router.delete('/forums/:forumId/bans/:userId', forumController.unbanForumMember);

// Forum Utility Routes
router.get('/forums/:forumId/membership/:userId', forumController.checkForumMembership);
router.get('/forums/:forumId/banned/:userId', forumController.checkIfBanned);

module.exports = router;