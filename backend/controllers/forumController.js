const forumService = require("../services/forumService");

module.exports = {
  async getForums(req, res) {
    try {
      const { page, limit } = req.query;

      const result = await forumService.getForums(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async createForum(req, res) {
    try {
      const forumData = req.body;

      const newForum = await forumService.createForum(forumData);

      res.status(201).json(newForum);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getForumById(req, res) {
    try {
      const { forumId } = req.params;

      const forum = await forumService.getForumById(forumId);

      res.status(200).json(forum);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateForum(req, res) {
    try {
      const { forumId } = req.params;
      const updateData = req.body;

      const updatedForum = await forumService.updateForum(forumId, updateData);

      res.status(200).json(updatedForum);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteForum(req, res) {
    try {
      const { forumId } = req.params;

      const result = await forumService.deleteForum(forumId);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
