const mongoose = require('mongoose');

const clubFollowSchema = new mongoose.Schema({
  club_id: { type: String, required: true, ref: 'Clubs' },
  user_id: { type: String, required: true, ref: 'User' },
  timestamp: { type: String, required: true }
});

module.exports = mongoose.model('ClubFollow', clubFollowSchema);
