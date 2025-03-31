const mongoose = require('mongoose');

const postLikesSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'User' },
  post_id: { type: String, required: true, ref: 'Posts' }
});

module.exports = mongoose.model('PostLikes', postLikesSchema);
