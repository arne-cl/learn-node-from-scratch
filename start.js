const mongoose = require('mongoose');

// Import environmental variables from our variables.env file.
// Variables will be available as 'process.env.$VARIABLE_NAME'.
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`mongoDB error: ${err.message}`);
});

// Import our MongoDB models from models/Store.js.
// This is a singleton, so we don't need to import it again in other files.
require('./models/Store');

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
