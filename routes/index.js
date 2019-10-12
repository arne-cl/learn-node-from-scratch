const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController')

router.get('/', storeController.myMiddleware, storeController.homePage);

// GET /name-age-params?name=John&age=23
router.get('/name-age-params', storeController.nameAgeExample);

router.get('/hello-world', (req, res) => {
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
