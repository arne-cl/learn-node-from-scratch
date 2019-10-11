const express = require('express');
const morgan = require('morgan');

const routes = require('./routes/index');

// create our Express app
const app = express();

if (app.get('node_env') == 'production') { // log request errors to file in production
  app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else { // log all requests to STDOUT in dev mode
  app.use(morgan('dev'));
}

// This is how we handle our routes
app.use('/', routes);


// done! we export it so we can start the site in start.js
module.exports = app;
