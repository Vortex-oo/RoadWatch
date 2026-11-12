const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  votes: {type: Number, required: true, default: 1},
  photo: { type: String }, // Store image URL or file path
  location: {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { 
      type: [Number], // MongoDB requires [longitude, latitude] order
      required: true 
    }
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'in-progress', 'resolved', 'dismissed'] 
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    required: true
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  confirmations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who confirmed this
  statusHistory: [statusHistorySchema]
}, { timestamps: true });

// Create a geospatial index for map queries
reportSchema.index({ location: '2dsphere' });

// Add initial status to history on creation
reportSchema.pre('save', function() {
  if (this.isNew) {
    this.statusHistory.push({ status: this.status });
  }
});

module.exports = mongoose.model('Report', reportSchema);