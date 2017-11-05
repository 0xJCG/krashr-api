// Load required packages
var mongoose = require('mongoose');

// Define our result schema
var ResultSchema = new mongoose.Schema({
  process: {type: String, required: true},
  web: {type: String, required: true},
  vulnerability: {type: String, required: true},
  date: {type: Date, required: true},
  user: {type: String, ref: 'User', required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Result', ResultSchema);