const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('home/index', { title: 'Express' });
});
router.get('/form', function (req, res) {
    res.render('home/form');
});

var ativoController = require('../controllers/ativoController');
router.get('/ativos', ativoController.index);

module.exports = router;



/* res.render('ativos/index', { title: 'Express' }  */