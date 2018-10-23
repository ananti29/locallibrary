var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/catalog');
});

router.get('/api', function (req, res, next) {
    res.redirect('/catalog/api');
});

module.exports = router;
