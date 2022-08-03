var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Index app2' });
  // console.log(router.stack);
  let base = res.locals.appContext;
  res.json({
    'project.json': base + 'project.json',
    'page.json': base + 'page.json',
    db: {
      'table.json': base + 'db/table.json'
    }
  });
});

module.exports = router;
