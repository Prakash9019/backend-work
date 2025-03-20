const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConnectionRequestSchema = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.ConnectionRequest || mongoose.model('ConnectionRequest', ConnectionRequestSchema);
