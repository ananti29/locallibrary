var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/cool', function (req, res, next) {
    res.send('I´m so cool. I know how to route!');
});

module.exports = router;
