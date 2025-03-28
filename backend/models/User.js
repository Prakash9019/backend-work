const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
