const express = require('express');
const morgan = require('morgan'); // logging
const bodyParser = require('body-parser') // parsing the request body
const flash = require('connect-flash'); // add messages to existing pages
const path = require('path'); // access server paths
const mongoose = require('mongoose');
const session = require('express-session'); // session support (needed for flash messages)
const MongoStore = require('connect-mongo')(session); // MongoDB session store

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

// Node does not parse the request body by itself. We have to use body-parser
// for this, e.g. when we want to retrieve form data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
// Example: /public/dist/foo.jpg will be served by a GET /dist/foo.jpg call
app.use(express.static(path.join(__dirname, 'public')));

// setup templating engine (pug aka jade)
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug');

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// The flash middleware let's us use req.flash('error', 'Shit!'),
// which will then pass that message to the next page the user requests.
// req.flash() will not work without sessions!
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  // all variables defined in helpers.js are now available as 'h.something'
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
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
