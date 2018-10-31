var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var ativoController = require('../controllers/ativoController');
router.get('/ativos', ativoController.index);

module.exports = router;



/* res.render('ativos/index', { title: 'Express' }  */