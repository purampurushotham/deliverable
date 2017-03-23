var express = require('express');
var router = express.Router();
//TODO: fix comment: Remove un-used files and console logs before you check-in code
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
