const mongoose = require('mongoose');

const banClubSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  club_id: { type: String, required: true, ref: 'Clubs' },
  banned_by_id: { type: String, required: true, ref: 'User' },
  banned_at: { type: String, required: true },
  reason: { type: String, required: true }
});

module.exports = mongoose.model('BanClub', banClubSchema);
