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

exports.getStores = async (req, res) => {
    // get all stores from db
    const stores = await Store.find();
    // ES pro tip for dicts: if key and value are the same, you can just pass the key,
    // i.e. {stores} equals {stores: stores}
    res.render('stores', {title: 'Stores', stores: stores});
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

// updateStore updates the given store (req.params.id) in MongoDB
// and redirects to that store's edit page.
exports.updateStore = async (req, res) => {
    // MongoDB: find and update the store in one go
    const query = { _id: req.params.id };
    const update = req.body;
    const options = {
        new: true, // return updated store instead of the old one
        runValidators: true // always run the model validators
                            // (by default, they're only run during model creation!)
    }

    // findOneAndUpdate() does only run, if we call exec() on it
    const store = await Store.findOneAndUpdate(query, update, options).exec();

    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store </a>`);
    res.redirect(`/stores/${store._id}/edit`);
};

exports.editStore = async (req, res) => {
    // req.params contains all the parts of a route that are marked with ':',
    // e.g. if we have a route '/stores/:id' and then `GET /stores/123`,
    // req.params.id will contain '123.
    //
    // .findOne() returns a Promise of one result from MongoDB
    const store = await Store.findOne({ _id: req.params.id });

    res.render('editStore', {
        title: `Edit ${store.name}`,
        store: store,
    });
    // res.json(store);
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
