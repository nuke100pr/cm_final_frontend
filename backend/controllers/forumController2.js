const forumService = require("../services/forumService2");

const createForum = async (req, res) => {
  try {
    const forumData = req.body;
    const imageFile = req.file; // Assuming you're using multer for file uploads
    console.log(imageFile);
    const newForum = await forumService.createForum(forumData, imageFile);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newForum,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllForums = async (req, res) => {
  try {
    const forums = await forumService.getAllForums(req.query);
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getForumById = async (req, res) => {
  try {
    const forum = await forumService.getForumById(req.params.id);
    res.json(forum);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateForum = async (req, res) => {
  try {
    const updatedForum = await forumService.updateForum(
      req.params.id,
      req.body
    );
    res.json(updatedForum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteForum = async (req, res) => {
  try {
    await forumService.deleteForum(req.params.id);
    res.json({ message: "Forum deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Forum Member Controllers
const addForumMember = async (req, res) => {
  try {
    const member = await forumService.addForumMember({
      ...req.body,
      forum_id: req.params.forumId,
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getForumMembers = async (req, res) => {
  try {
    const members = await forumService.getForumMembers(req.params.forumId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeForumMember = async (req, res) => {
  try {
    await forumService.removeForumMember(req.params.forumId, req.params.userId);
    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Forum Ban Controllers
const banForumMember = async (req, res) => {
  try {
    const ban = await forumService.banForumMember({
      ...req.body,
      forum_id: req.params.forumId,
      banned_by: req.user.id, // Assuming user ID is available in req.user
    });
    res.status(201).json(ban);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getForumBans = async (req, res) => {
  try {
    const bans = await forumService.getForumBans(req.params.forumId);
    res.json(bans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unbanForumMember = async (req, res) => {
  try {
    await forumService.unbanForumMember(req.params.forumId, req.params.userId);
    res.json({ message: "Member unbanned successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Utility Controllers
const checkForumMembership = async (req, res) => {
  try {
    const isMember = await forumService.checkForumMembership(
      req.params.forumId,
      req.params.userId
    );
    res.json({ isMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkIfBanned = async (req, res) => {
  try {
    const isBanned = await forumService.checkIfBanned(
      req.params.forumId,
      req.params.userId
    );
    res.json({ isBanned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Forum CRUD
  createForum,
  getAllForums,
  getForumById,
  updateForum,
  deleteForum,

  // Member management
  addForumMember,
  getForumMembers,
  removeForumMember,

  // Ban management
  banForumMember,
  getForumBans,
  unbanForumMember,

  // Utility functions
  checkForumMembership,
  checkIfBanned,
};
