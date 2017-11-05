// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Load required controllers
var resultController = require('./controllers/result');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var coreController = require('./controllers/core');

// Load required configuration files
var config = require('./config/config');

// Create our Express application
var app = express();

// Connect to the krashr2 MongoDB
mongoose.connect(config.database, function(err, res) {
  if (err) throw err;
  console.log('Connected to Krashr database');
});

// Custom headers
app.all('*', function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, X-Requested-With, x-access-token, Content-Type, Accept, Authorization");
  next();
});

// Use the body-parser package so we can get info from POST and/or URL parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the Krashr API!' });
});

// Create endpoint handlers for /results
router.route('/results')
  .get(authController.isAuthenticated, resultController.getResults);

// Create endpoint handlers for /results/:process
router.route('/results/:process')
  .get(authController.isAuthenticated, resultController.getResult);

// Create endpoint handlers for /result/number
router.route('/result/number')
  .get(authController.isAuthenticated, resultController.getResultNumber);

// Create endpoint handlers for /result/current
router.route('/result/current')
  .get(authController.isAuthenticated, resultController.getCurrentResult);

// Create endpoint handlers for /search
router.route('/search')
  .post(authController.isAuthenticated, resultController.search);

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Create endpoint handlers for /user
router.route('/user')
  .get(authController.isAuthenticated, userController.getUser);

// Create endpoint handlers for /authenticate
router.route('/authenticate')
  .post(authController.authenticate);

// Create endpoint handlers of store the result of the Python server
router.route('/saveresult')
    .post(coreController.saveResult);

// Register all our routes
app.use(router);

// Start the server
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});