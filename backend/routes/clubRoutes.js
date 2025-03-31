const express = require('express');
const clubController = require('../controllers/clubController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const multer = require("multer");

// Configure multer for file uploads
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

// Public routes
router.get('/clubs', clubController.fetchAllClubs);
router.get('/clubs/board/:board_id', clubController.fetchClubsByBoardId);
router.get('/clubs/:club_id', clubController.fetchClubById);
router.get('/users/:user_id/clubs', clubController.fetchClubsByUserId);



router.post('/clubs', upload.single('image'), clubController.createClub);
router.put('/clubs/:club_id', upload.single('image'), clubController.editClub);
router.delete('/clubs/:club_id', clubController.deleteClub);
router.post('/users/:user_id/follow/club/:club_id', clubController.followClub);
router.delete('/users/:user_id/unfollow/club/:club_id', clubController.unfollowClub);

module.exports = router;