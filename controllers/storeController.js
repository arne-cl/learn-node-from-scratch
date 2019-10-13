const mongoose = require('mongoose');

// Import our database schema from models/Store.js.
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  // req.name should be available if our route calls myMiddleware before homePage
  console.log(req.name);

  res.render('index', {
    title: 'Home'
  });
};

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store',
    });
};

exports.createStore = async (req, res) => {
    // Create a new Store instance directly from the form fields.
    // Since we're using a strict schema, we don't have to worry about
    // missing/superflous fields in the incoming request.
    const store = new Store(req.body);

    // Wait until the Store instance is saved in MongoDB.
    // To avoid wrapping this in a try/catch block,
    // we will wrap the function call in 'errorHandlers.catchErrors'.
    await store.save();
    
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    // redirect to the page of the store we just created
    res.redirect(`/store/${store.slug}`);
};


// Returns a rendered request with name/age params.
// Example: GET /?name=John&age=23
exports.nameAgeExample = (req, res) => {
  // render 'views/hello.pug'
  // (we specified the folder and templating engine in app.js)
  res.render('hello', {
    name: req.query.name,
    age: req.query.age,
    title: 'purrfect'
  });
};
