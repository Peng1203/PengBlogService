var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log('process.env -----', process.env.NODE_ENV)
  res.send(`你好 当前开发环境${res.locals.env}`);

});

module.exports = router;
