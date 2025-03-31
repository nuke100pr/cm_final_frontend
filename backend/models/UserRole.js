const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'User' },
  role: { type: String, enum: ['super_admin', 'admin', 'club_Admin', 'Normal'], required: true },
  club_id: { type: String, ref: 'Clubs' },
  board_id: { type: String, ref: 'Boards' }
});

module.exports = mongoose.model('UserRole', userRoleSchema);
