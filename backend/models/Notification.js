const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link_id: { type: String, required: true, ref: 'NotificationLink' },
  user_id: { type: String, required: true, ref: 'User' },
  status: { type: String, enum: ['read', 'not_read'], required: true }
});

module.exports = mongoose.model('Notification', notificationSchema);
