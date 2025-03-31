const { Forum } = require("../models/Forum");
const mongoose = require("mongoose");

module.exports = {
  async getForums(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const forums = await Forum.find()
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Forum.countDocuments();

      return {
        forums,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  },

  async createForum(forumData) {
    try {
      const { name, description, created_by } = forumData;

      if (!name || !description || !created_by) {
        throw new Error("Name, description, and created_by are required");
      }

      const newForum = await Forum.create({
        name,
        description,
        created_by,
      });

      return newForum;
    } catch (error) {
      throw error;
    }
  },

  async getForumById(forumId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(forumId)) {
        throw new Error("Invalid forum ID");
      }

      const forum = await Forum.findById(forumId).lean();

      if (!forum) {
        throw new Error("Forum not found");
      }

      return forum;
    } catch (error) {
      throw error;
    }
  },

  async updateForum(forumId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(forumId)) {
        throw new Error("Invalid forum ID");
      }

      const updatedForum = await Forum.findByIdAndUpdate(forumId, updateData, {
        new: true,
      }).lean();

      if (!updatedForum) {
        throw new Error("Forum not found");
      }

      return updatedForum;
    } catch (error) {
      throw error;
    }
  },

  async deleteForum(forumId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(forumId)) {
        throw new Error("Invalid forum ID");
      }

      const deletedForum = await Forum.findByIdAndDelete(forumId);

      if (!deletedForum) {
        throw new Error("Forum not found");
      }

      return { success: true, message: "Forum deleted successfully" };
    } catch (error) {
      throw error;
    }
  },
};
