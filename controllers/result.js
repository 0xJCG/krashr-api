// Load required packages
var JsonSocket = require('json-socket');

// Load required models
var Result = require('../models/result');
var User = require('../models/user');

// Create endpoint /results for GET
exports.getResults = function(req, res) {
  // Use the Result model to find all results
  Result.find({ userId: req._id }, function(err, results) {
    if (err)
      return res.send(err);

    res.json(results);
  });
};

// Create endpoint /results/:process for GET
exports.getResult = function(req, res) {
  // Use the Result model to find a specific results
  Result.find({ userId: req._id, process: req.params.process }, function(err, result) {
    if (err)
      return res.send(err);

    res.json(result);
  });
};


// Create endpoint /result/number for GET
exports.getResultNumber = function(req, res) {
  // Use the Result model to find a specific results
  Result.find({ userId: req._id }, function(err, results) {
    if (err)
      return res.send(err);

    var d = {length: Object.keys(results).length}
    res.json(d);
  });
};


// Create endpoint /result/current for GET
exports.getCurrentResult = function(req, res) {
  // Use the User model to find a specific user to ask the server his/her current search
  User.findOne({ _id: req._id }, function(err, user) {
    var msg = {
	  "user": user.username
	}

    // http://stackoverflow.com/questions/8407460/sending-data-from-node-js-to-java-using-sockets
    // Opening a socket to communicate with the Python server.
    var net = require('net');
    var socket = new JsonSocket(new net.Socket()); // Decorate a standard net.Socket with JsonSocket
    socket.connect(9999, '127.0.0.1');
    socket.on('connect', function() { // Don't send until we're connected
      socket.sendMessage(msg);
      socket.on('data', function(data) {
        res.send(data);
      });
    });
  });
};


// Create endpoint /search for POST
exports.search = function(req, res) {
  // Use the User model to find a specific user to tell the server his/her new search
  User.findOne({ _id: req._id }, function(err, user) {
    var msg = {
      "user": user.username,
      "url": req.body.url,
      "search_options": [
        {
          "number": 1,
          "module": "crawler"
        },
        {
          "number": 2,
          "module": "sqlinjection"
        },
        {
          "number": 3,
          "module": "crsf"
        }
      ]
    }

    // https://github.com/sebastianseilund/node-json-socket
    JsonSocket.sendSingleMessage(9999, '127.0.0.1', msg, function(err) {
      if (!err) {
        res.send(true);
      }
      res.send(err);
    });
  });
};