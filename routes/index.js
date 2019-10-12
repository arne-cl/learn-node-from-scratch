const express = require('express');
const router = express.Router();

// Returns a rendered request with name/age params.
// Example: GET /?name=John&age=23
router.get('/', (req, res) => {
  // render 'views/hello.pug'
  // (we specified the folder and templating engine in app.js)
  res.render('hello', {
    name: req.query.name,
    age: req.query.age,
  });
});

router.get('/example', (req, res) => {
  res.send('Hello world!');
});


// take a GET request and echo the parameters as JSON.
// Example: GET /json?name=John&age=23
//          {"name":"John","age":"23"}
router.get('/json', (req, res) => {
  res.json(req.query);
});

// Return the reversed value of the ?name parameter.
// Example: GET /reverse/john
//          nhoj
router.get('/reverse/:name', (req, res) => {
  // reverse a string by splitting it into an array, reverse and rejoin into a string
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
