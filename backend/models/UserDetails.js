const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'User' },
  image: { type: String, ref: 'File' },
  status: { type: String, required: true }
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);
