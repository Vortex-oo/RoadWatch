const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'citizen',
    enum: ['citizen', 'admin'] // Add other roles here if needed in the future
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);