const mongoose = require('mongoose');

const forumMemberBanSchema = new mongoose.Schema({
  user_id: { type: String, required: true, ref: 'User' },
  forum_id: { type: String, required: true, ref: 'Forums' },
  reason: { type: String, required: true },
  banned_at: { type: String, required: true },
  banned_by: { type: String, required: true, ref: 'User' }
});

module.exports = mongoose.model('ForumMemberBan', forumMemberBanSchema);
