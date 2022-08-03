var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('wdi '+router.wdi);
  res.render('index', { title: 'Index root' });
});

module.exports = router;
