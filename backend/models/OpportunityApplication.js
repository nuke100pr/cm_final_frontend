const mongoose = require('mongoose');

const opportunityApplicationSchema = new mongoose.Schema({
  opportunity_id: { type: String, required: true, ref: 'Opportunities' },
  applicant_id: { type: String, required: true, ref: 'User' },
  submitted_at: { type: Date, required: true },
  updated_at: { type: Date, required: true }
});

module.exports = mongoose.model('OpportunityApplication', opportunityApplicationSchema);
