const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const ClubFollow = require('../models/ClubFollow');
const PostLikes = require('../models/PostLikes');

class UserService {
  // Create a new user
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  // Delete user by ID
  async deleteUserById(userId) {
    // Delete user details first
    await UserDetails.findOneAndDelete({ user_id: userId });
    // Delete the user
    return await User.findByIdAndDelete(userId);
  }

  // Fetch user details by user ID
  async fetchUserDetailsById(userId) {
    return await UserDetails.findOne({ user_id: userId }).populate('user_id');
  }

  // Edit user details by user ID
  async editUserDetailsById(userId, updateData) {
    return await UserDetails.findOneAndUpdate({ user_id: userId }, updateData, { new: true });
  }

  // List all users
  async listAllUsers() {
    return await User.find({});
  }

  // Fetch all users
  async fetchAllUsers() {
    return await User.find({});
  }

  // Fetch users by club_id (users that follow a club)
  async fetchUsersByClubId(clubId) {
    const followers = await ClubFollow.find({ club_id: clubId }).populate('user_id');
    return followers.map(follower => follower.user_id);
  }

  // Edit user by ID
  async editUserById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  // Unfollow a club by club_id and user_id
  async unfollowClub(userId, clubId) {
    return await ClubFollow.findOneAndDelete({ user_id: userId, club_id: clubId });
  }

  // Follow a club by club_id and user_id
  async followClub(userId, clubId) {
    const follow = new ClubFollow({ user_id: userId, club_id: clubId });
    return await follow.save();
  }

  // Like a post by user_id and post_id
  async likePost(userId, postId) {
    const like = new PostLikes({ user_id: userId, post_id: postId });
    return await like.save();
  }

  // Fetch like by user_id and post_id
  async fetchLike(userId, postId) {
    return await PostLikes.findOne({ user_id: userId, post_id: postId });
  }

  // Unlike a post by user_id and post_id
  async unlikePost(userId, postId) {
    return await PostLikes.findOneAndDelete({ user_id: userId, post_id: postId });
  }
}

module.exports = new UserService();