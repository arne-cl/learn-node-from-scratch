const express = require('express');
const morgan = require('morgan'); // for logging

const path = require('path'); // access server paths

const helpers = require('./helpers'); // helper functions and constants used by Wes Bos
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers'); // custom error handlers

// create our Express app
const app = express();

// setup logging for requests
if (app.get('node_env') == 'production') { // log request errors to file in production
  app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else { // log all requests to STDOUT in dev mode
  app.use(morgan('dev'));
}

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
// Example: /public/dist/foo.jpg will be served by a GET /dist/foo.jpg call
app.use(express.static(path.join(__dirname, 'public')));

// setup templating engine (pug aka jade)
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug');

// pass variables to our templates + all requests
app.use((req, res, next) => {
  // all variables defined in helpers.js are now available as 'h.something'
  res.locals.h = helpers;
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// This is how we handle our routes.
app.use('/', routes);


// Lots of fancy error handling happens if the routes do not succeed.

// If not found, return a 404.
app.use(errorHandlers.notFound);

// Check, if it is just a validation error
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect!
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);



// We export the app, so we can use it in start.js.
module.exports = app;
