var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Shopping List',
    cart: [
      'a loaf of bread',
      '3 beers',
      'peanuts'
    ]});
});

module.exports = router;
