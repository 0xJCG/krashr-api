// Load required packages
var jwt = require('jsonwebtoken');

// Load required models
var User = require('../models/user');

// Load required configuration files
var config = require('../config/config');

// Create endpoint /authenticate for POST
exports.authenticate = function(req, res) {
  // Use the User model to find the user to authenticate
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // Check if password matches
      if (!user.verifyPassword(req.body.password)) { // Using bcrypt
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // If user is found and password is right
        // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
        const payload = {
          id: user._id // For future use
        };

        var token = jwt.sign(payload, config.secret, {
          expiresInMinutes: 1440 // Expires in 24 hours
        });

        // Return the information including token as JSON
        res.json({
          success: true,
          message: 'Krashr API token.',
          token: token
        });
      }
    }
  });
};

// Check if an user is authenticated
exports.isAuthenticated = function(req, res, next) {
  // Check header for the token
  var token = req.headers['x-access-token'];

  // Decode token
  if (token) {
    // Verify secret and check it
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // Save the _id to request for use in other routes
        req._id = decoded.id;
        next();
      }
    });
  } else {
    // There is no token
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
};