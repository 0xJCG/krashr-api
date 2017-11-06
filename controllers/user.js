// Load required packages
var User = require('../models/user');

// Create endpoint /users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    admin: false,
  });

  user.save(function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'Welcome to Krashr!' });
  });
};

// Create endpoint /users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      return res.send(err);

    res.json(users);
  });
};

// Create endpoint /user for GET
exports.getUser = function(req, res) {

  // Use the User model to find a specific user
  User.findOne({ _id: req._id }, function(err, user) {
    if (err)
      return res.send(err);

    res.json(user);
  });
};