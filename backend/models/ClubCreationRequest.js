const mongoose = require('mongoose');

const clubCreationRequestSchema = new mongoose.Schema({
  board_id: { type: String, required: true, ref: 'Boards' },
  user_id: { type: String, required: true, ref: 'User' },
  status: { type: String, enum: ['pending_admin_approval', 'pending_super_admin_approval'], required: true }
});

module.exports = mongoose.model('ClubCreationRequest', clubCreationRequestSchema);
