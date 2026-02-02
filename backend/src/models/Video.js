const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  filename: String,
  status: { type: String, default: "processing" },
  safety: { type: String, default: "pending" },
  path: String,
});

module.exports = mongoose.model("Video", videoSchema);
