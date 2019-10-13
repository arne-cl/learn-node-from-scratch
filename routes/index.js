const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController')

// { foo } object destructuring: allows us to just import 'catchErrors'
// instead of importing 'errorHandlers' and then referencing 'errorHandlers.catchErrors'
const { catchErrors } = require('../handlers/errorHandlers')


router.get('/', storeController.homePage);

router.get('/add', storeController.addStore);
// createStore is an async function that doesn't catch any potential errors,
// so we'll wrap it in catchErrors().
router.post('/add', catchErrors(storeController.createStore));


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
