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

exports.createStore = (req, res) => {
    res.json(req.body);
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
