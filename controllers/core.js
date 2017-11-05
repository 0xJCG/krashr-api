// Load required packages
var mongoose = require('mongoose');

// Load required models
var Result = mongoose.model('Result');
var User = mongoose.model('User');

// Store the results coming from the Python server
exports.saveResult = function(request, response) {
  var b = request.body;
  User.findOne({username: b.USER}, function(error, user) {
    if (user) {
      Result.create({process: b.PROCESS, web: b.WEB, vulnerability: b.VULNERABILITY, user: user._id, date: Date.now()}, function(error, result) { // Inserting the new result.
        if (error) response.status(500).send(false);
        else {
          User.findByIdAndUpdate(user._id,
            {$push: {results: result._id}},
            {safe: true, upsert: true, new : true},
            function(err, model) {
              if (err) response.status(200).send(false);
              else response.status(200).send(true);
            }
          );
        }
      });
    } else response.status(500).send(false);
  });
};