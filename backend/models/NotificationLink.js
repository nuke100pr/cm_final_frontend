const mongoose = require('mongoose');

const notificationLinkSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  notification_id: { type: String, required: true, ref: 'Notification' },
  content: { type: String, required: true }
});

module.exports = mongoose.model('NotificationLink', notificationLinkSchema);
