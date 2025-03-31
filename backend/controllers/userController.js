const userService = require('../services/userService');

class UserController {
  // Create a new user
  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete user by ID
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userService.deleteUserById(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Fetch user details by user ID
  async fetchUserDetails(req, res) {
    try {
      const { user_id } = req.params;
      const userDetails = await userService.fetchUserDetailsById(user_id);
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Edit user details by user ID
  async editUserDetails(req, res) {
    try {
      const { user_id } = req.params;
      const updateData = req.body;
      const updatedDetails = await userService.editUserDetailsById(user_id, updateData);
      res.status(200).json(updatedDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // List all users
  async listAllUsers(req, res) {
    try {
      const users = await userService.listAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Fetch all users
  async fetchAllUsers(req, res) {
    try {
      const users = await userService.fetchAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Fetch users by club_id
  async fetchUsersByClubId(req, res) {
    try {
      const { club_id } = req.params;
      const users = await userService.fetchUsersByClubId(club_id);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Edit user by ID
  async editUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedUser = await userService.editUserById(id, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Unfollow a club
  async unfollowClub(req, res) {
    try {
      const { user_id, club_id } = req.params;
      await userService.unfollowClub(user_id, club_id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Follow a club
  async followClub(req, res) {
    try {
      const { user_id, club_id } = req.params;
      const follow = await userService.followClub(user_id, club_id);
      res.status(201).json(follow);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Like a post
  async likePost(req, res) {
    try {
      const { user_id, post_id } = req.params;
      const like = await userService.likePost(user_id, post_id);
      res.status(201).json(like);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Fetch like by user_id and post_id
  async fetchLike(req, res) {
    try {
      const { user_id, post_id } = req.params;
      const like = await userService.fetchLike(user_id, post_id);
      res.status(200).json(like);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Unlike a post
  async unlikePost(req, res) {
    try {
      const { user_id, post_id } = req.params;
      await userService.unlikePost(user_id, post_id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();