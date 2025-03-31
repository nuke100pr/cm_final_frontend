const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'User' },
  posts: { type: Boolean, required: true },
  events: { type: Boolean, required: true },
  blogs: { type: Boolean, required: true },
  projects: { type: Boolean, required: true },
  approval: { type: Boolean, required: true },
  resource: { type: Boolean, required: true },
  forum: { type: Boolean, required: true },
  memberships: { type: Boolean, required: true },
  opportunities: { type: Boolean, required: true }
});

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
