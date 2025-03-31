const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/users', userController.createUser);  // New route for user creation
router.get('/users', userController.fetchAllUsers);
router.get('/users/club/:club_id', userController.fetchUsersByClubId);
router.get('/users/:user_id/details', userController.fetchUserDetails);

// Protected routes (if needed in future)
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id', userController.editUser);
router.put('/users/:user_id/details', userController.editUserDetails);
router.post('/users/:user_id/follow/:club_id', userController.followClub);
router.delete('/users/:user_id/unfollow/:club_id', userController.unfollowClub);
router.post('/users/:user_id/like/:post_id', userController.likePost);
router.get('/users/:user_id/like/:post_id', userController.fetchLike);
router.delete('/users/:user_id/unlike/:post_id', userController.unlikePost);

module.exports = router;