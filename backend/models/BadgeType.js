const mongoose = require('mongoose');

const badgeTypeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  emoji: { type: String, required: true }
});

module.exports = mongoose.model('BadgeType', badgeTypeSchema);
