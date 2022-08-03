var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(
    {
      links: {
        users: res.locals.appContext+'users',
        hknews: res.locals.appContext+'hknews',
        stackoverflow: res.locals.appContext+'stackoverflow',
        duckduckgo: res.locals.appContext+'duckduckgo',
      }
    }
  );

  // res.render('index', { title: 'Index app1' });
});

module.exports = router;
