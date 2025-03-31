const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForumSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Forum = mongoose.model("Forum", ForumSchema);

module.exports = Forum;


