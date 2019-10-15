const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController')

// { foo } object destructuring: allows us to just import 'catchErrors'
// instead of importing 'errorHandlers' and then referencing 'errorHandlers.catchErrors'
const { catchErrors } = require('../handlers/errorHandlers')

// All async controllers must be wrapped in catchErrors(), because we didn't
// bother to wrap them in try/catch blocks!


router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));

// edit existing store (ID given by request param)
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

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
