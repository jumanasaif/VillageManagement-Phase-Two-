const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Image', ImageSchema);
