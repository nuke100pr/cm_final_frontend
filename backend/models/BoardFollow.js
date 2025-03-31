const mongoose = require('mongoose');

const boardFollowSchema = new mongoose.Schema({
  board_id: { type: String, required: true, ref: 'Boards' },
  user_id: { type: String, required: true, ref: 'User' },
  timestamp: { type: String, required: true }
});

module.exports = mongoose.model('BoardFollow', boardFollowSchema);
