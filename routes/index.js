const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hey! It works! Echt');
});

router.get('/json', (req, res) => {
  const user = {name: 'John', age: 42};
  res.json(user);
});


module.exports = router;
